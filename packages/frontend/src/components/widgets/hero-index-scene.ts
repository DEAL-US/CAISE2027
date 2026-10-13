import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import dracoWrapperUrl from 'three/addons/libs/draco/gltf/draco_wasm_wrapper.js?url';
import dracoWasmUrl from 'three/addons/libs/draco/gltf/draco_decoder.wasm?url';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Evalúa ventanas de al menos un segundo de animación activa.
/**
 * Detect sustained low frame rates after the warmup period.
 */
function createFpsGuard(minFps = 25, lowDuration = 3000, warmup = 1500) {
  let elapsed = 0,
    frames = 0,
    lowTime = 0;
  return {
    reset() {
      elapsed = 0;
      frames = 0;
      lowTime = 0;
    },
    sample(milliseconds: number) {
      if (milliseconds <= 0) return false;
      if (warmup > 0) {
        warmup -= milliseconds;
        return false;
      }
      elapsed += milliseconds;
      frames++;
      if (elapsed < 1000) return false;
      const fps = (frames * 1000) / elapsed;
      lowTime = fps < minFps ? lowTime + elapsed : 0;
      elapsed = 0;
      frames = 0;
      return lowTime >= lowDuration;
    }
  };
}
// Each navigation gets its own scene and event listeners.
let cleanupScene: (() => void) | undefined;

/**
 * Release shared geometry, materials, textures and shadow buffers once.
 */
function disposeModel(root: THREE.Object3D) {
  const resources = new Set<{ dispose: () => void }>();
  root.traverse((object) => {
    if ('shadow' in object && object.shadow instanceof THREE.LightShadow) {
      resources.add(object.shadow);
    }
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) return;
    resources.add(object.geometry);
    const materials = Array.isArray(object.material)
      ? object.material
      : object.material ? [object.material] : [];
    for (const material of materials) {
      resources.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) resources.add(value);
      }
    }
  });
  for (const resource of resources) resource.dispose();
}

/**
 * Initialize the current hero and register its navigation cleanup.
 */
async function initScene() {
  cleanupScene?.();
  cleanupScene = undefined;
  // Constantes para tener a mano el elemento contenedor
  const canvas = document.querySelector('#scene');
  if (!(canvas instanceof HTMLCanvasElement) || !canvas.parentElement) return;
  const container = canvas.parentElement;
  container.classList.remove('scene-ready');
  const events = new AbortController();
  const { signal } = events;
  const state: { disposed: boolean; composer?: EffectComposer } = { disposed: false };
  let frame = 0;
  let model: THREE.Object3D | undefined;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const draco = new DRACOLoader();
  const release = () => {
    if (state.disposed) return;
    state.disposed = true;
    container.classList.remove('scene-ready');
    events.abort();
    cancelAnimationFrame(frame);
    if (state.composer) {
      for (const pass of state.composer.passes) pass.dispose();
      state.composer.dispose();
    }
    if (model) disposeModel(model);
    renderer.dispose();
  };
  cleanupScene = release;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.5;

  try {
    const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
    draco.setDecoderPath({ js: dracoWrapperUrl, wasm: dracoWasmUrl });
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    const gltf = await loader.loadAsync(base + 'models/Sevilla-comp.glb')
      .finally(() => draco.dispose());
    if (state.disposed) {
      disposeModel(gltf.scene);
      return;
    }
    model = gltf.scene;
    // GLTFLoader devuelve un Group. BokehPass necesita una Scene real
    // para aplicar el material de profundidad mediante overrideMaterial.
    const scene = new THREE.Scene();
    scene.add(gltf.scene); // Conserva la cámara, los objetos y la luz exportada.
    const loadedCamera = gltf.cameras[0];
    if (!(loadedCamera instanceof THREE.PerspectiveCamera || loadedCamera instanceof THREE.OrthographicCamera)) {
      throw new Error('The GLB does not contain a supported camera.');
    }
    const camera = loadedCamera;

    // Relleno suave para las superficies que no reciben sol.
    scene.add(new THREE.HemisphereLight(0xeef4ff, 0x00caff, 2));
    scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const center = bounds.getCenter(new THREE.Vector3());
    const radius = bounds.getSize(new THREE.Vector3()).length() / 2;
    const suns: THREE.DirectionalLight[] = [];
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        for (const material of materials) {
          if (material.name === 'base' && 'flatShading' in material) {
            // Normales de cara: evita suavizar entre paredes y tejados.
            // Los triangulos coplanares reciben la misma iluminacion.
            material.flatShading = true;
            material.needsUpdate = true;
          }
        }
      }
      if (object instanceof THREE.DirectionalLight) suns.push(object);
    });
    for (const sun of suns) {
      sun.intensity = 5;
      sun.castShadow = true;
      sun.shadow.mapSize.set(4096, 4096);
      // La siguiente línea hace lo siguiente
      Object.assign(sun.shadow.camera, {
        left: -radius,
        right: radius,
        top: radius,
        bottom: -radius,
        near: radius * 0.1,
        far: radius * 4
      });
      sun.shadow.camera.updateProjectionMatrix();
      sun.shadow.normalBias = radius * 0.0005;
      sun.shadow.bias = -0.00005;
    }

    // GLTFLoader elimina el punto del nombre de Blender.
    const object
      = scene.getObjectByName('Water.003')
        ?? scene.getObjectByName(
          THREE.PropertyBinding.sanitizeNodeName('Water.003')
        );
    if (!object) throw new Error('No se encuentra Water.003 en la escena.');

    const pivot = new THREE.Group();
    pivot.position.copy(
      scene.worldToLocal(object.getWorldPosition(new THREE.Vector3()))
    );
    scene.add(pivot);
    pivot.attach(camera); // Conserva el encuadre original al cambiar de padre.
    pivot.rotation.order = 'YXZ';

    // Profundidad de campo: distancias medidas sobre el eje de la cámara.
    scene.updateMatrixWorld(true);
    const focusPoint = center.clone();
    let targetFocus = -camera.worldToLocal(focusPoint.clone()).z;
    const dof = new BokehPass(scene, camera, {
      focus: targetFocus,
      aperture: 0.0025, // Menor valor = menor profundidad de campo.
      maxblur: 0.006 // Radio máximo como fracción del ancho de pantalla.
    });
    dof.materialBokeh.defines.PERSPECTIVE_CAMERA = camera instanceof THREE.PerspectiveCamera
      ? 1
      : 0;
    // El shader original fuerza alfa 1; conserva la transparencia del canvas.
    dof.materialBokeh.fragmentShader = dof.materialBokeh.fragmentShader.replace(
      'gl_FragColor.a = 1.0;',
      ''
    );
    const composer = new EffectComposer(renderer);
    state.composer = composer;
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(dof);
    composer.addPass(new OutputPass()); // Conserva ACES y la salida sRGB.

    let dofEnabled = true;
    let resolutionReduced = false;
    const fpsGuard = createFpsGuard(25, 3000, 1500);
    /**
     * Render with the currently selected quality level.
     */
    function renderScene(delta = 0) {
      if (dofEnabled) composer.render(delta);
      else renderer.render(scene, camera);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerInside = false;
    let focusDirty = false;
    // Plano matemático horizontal: no se dibuja ni recorre los triángulos.
    // Ajusta esta altura si prefieres enfocar más cerca de los tejados.
    const focusPlaneHeight = bounds.min.y;
    const focusPlane = new THREE.Plane(
      new THREE.Vector3(0, 1, 0),
      -focusPlaneHeight
    );

    /**
     * Update depth of field from the pointer intersection with the map.
     */
    function pickFocus() {
      if (!dofEnabled || !pointerInside || !focusDirty) return;
      focusDirty = false;
      camera.updateWorldMatrix(true, false);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.ray.intersectPlane(focusPlane, focusPoint);
      if (
        !hit
        || hit.x < bounds.min.x
        || hit.x > bounds.max.x
        || hit.z < bounds.min.z
        || hit.z > bounds.max.z
      )
        return;
      const depth = -camera.worldToLocal(focusPoint).z;
      if (depth >= camera.near && depth <= camera.far) targetFocus = depth;
      // Fuera del rectángulo del mapa conserva el último enfoque.
    }

    const maxAngle = THREE.MathUtils.degToRad(5);
    const target = new THREE.Vector2();
    const current = new THREE.Vector2();
    const isMobile
      = navigator.maxTouchPoints > 0
        && window.matchMedia('(pointer: coarse)').matches;
    const screenOrientation = (screen as { orientation?: ScreenOrientation }).orientation;
    const gyroOrigin = new THREE.Vector2();
    let gyroHasOrigin = false;
    let gyroEnabled = false;
    let previousTime: number | null = null;

    /**
     * Calculate the shortest signed difference between two angles.
     */
    function signedAngleDelta(angle: number, origin: number) {
      return THREE.MathUtils.euclideanModulo(angle - origin + 180, 360) - 180;
    }

    /**
     * Translate device tilt into a bounded camera rotation.
     */
    function handleOrientation(event: DeviceOrientationEvent) {
      if (!isMobile || event.beta === null || event.gamma === null) return;

      if (!gyroHasOrigin) {
        gyroOrigin.set(event.beta, event.gamma);
        gyroHasOrigin = true;
        return;
      }

      const beta = signedAngleDelta(event.beta, gyroOrigin.x);
      const gamma = signedAngleDelta(event.gamma, gyroOrigin.y);
      const screenAngle = THREE.MathUtils.degToRad(
        screenOrientation?.angle ?? (window as { orientation?: number }).orientation ?? 0
      );
      const horizontal
        = gamma * Math.cos(screenAngle) + beta * Math.sin(screenAngle);
      const vertical
        = beta * Math.cos(screenAngle) - gamma * Math.sin(screenAngle);

      target
        .set(
          THREE.MathUtils.degToRad(horizontal),
          THREE.MathUtils.degToRad(vertical)
        )
        .clampLength(0, maxAngle);
      requestMotion();
    }

    // Safari exposes a permission request that is not part of the standard DOM types.
    const orientationEvent = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<PermissionState> })
      | undefined;

    /**
     * Subscribe to orientation events for the active scene.
     */
    function startGyroscope() {
      if (state.disposed || !isMobile || gyroEnabled || !orientationEvent)
        return;
      gyroEnabled = true;
      window.addEventListener('deviceorientation', handleOrientation, { signal });
    }

    /**
     * Request sensor access on browsers that require a user gesture.
     */
    async function requestGyroscopePermission() {
      if (!isMobile || gyroEnabled || !orientationEvent)
        return;
      if (typeof orientationEvent.requestPermission !== 'function') {
        startGyroscope();
        return;
      }
      try {
        if ((await orientationEvent.requestPermission()) === 'granted')
          startGyroscope();
      } catch (error) {
        console.warn('Could not activate gyroscope.', error);
      }
    }

    // Android suele permitir el sensor directamente. En iOS la petición
    // debe ejecutarse dentro de un gesto del usuario (el primer toque).
    if (
      isMobile
      && orientationEvent
      && typeof orientationEvent.requestPermission !== 'function'
    )
      startGyroscope();

    /**
     * Advance camera motion and focus until both settle.
     */
    function animate(time: number) {
      if (state.disposed) return;
      if (document.hidden) {
        frame = 0;
        previousTime = null;
        fpsGuard.reset();
        return;
      }
      // Los FPS usan tiempo real; solo la interpolación limita el delta.
      const elapsed = previousTime === null ? 0 : time - previousTime;
      previousTime = time;
      if (dofEnabled && fpsGuard.sample(elapsed)) {
        // Cada nivel requiere su propia ventana de bajo rendimiento.
        // Conserva la calidad elegida hasta recargar para evitar oscilaciones.
        fpsGuard.reset();
        if (!resolutionReduced) {
          resolutionReduced = true;
          const pixelRatio = renderer.getPixelRatio() / 2;
          // Reduce también los buffers del blur, conservando el tamaño CSS.
          renderer.setPixelRatio(pixelRatio);
          composer.setPixelRatio(pixelRatio);
          console.info(
            'Resolution reduced to half to keep performance.'
          );
        } else {
          dofEnabled = false;
          dof.enabled = false;
          console.info(
            'DoF disabled to keep performance.'
          );
        }
      }
      const delta = Math.min(elapsed / 1000, 0.05);
      current.lerp(target, 1 - Math.exp(-8 * delta));
      // No hacemos nada si hay poca distancia a donde se quiere llegar
      const settled = current.distanceToSquared(target) < 1e-10;
      if (settled) current.copy(target);
      pivot.rotation.x = current.y;
      pivot.rotation.y = current.x;
      if (!settled) focusDirty = true;
      pickFocus();
      const focus = (dof.uniforms as { focus: THREE.IUniform<number> }).focus;
      focus.value = THREE.MathUtils.lerp(
        focus.value,
        targetFocus,
        1 - Math.exp(-6 * delta)
      );
      const focusSettled
        = !dofEnabled || Math.abs(focus.value - targetFocus) < 0.0001;
      if (focusSettled) focus.value = targetFocus;
      renderScene(delta);
      // Descansa solo cuando han terminado tanto el giro como el enfoque.
      frame = settled && focusSettled ? 0 : requestAnimationFrame(animate);
    }

    /**
     * Schedule an animation frame when the visible scene needs one.
     */
    function requestMotion() {
      if (!state.disposed && !frame && !document.hidden) {
        previousTime = null; // No cuenta el tiempo que estuvo quieto.
        fpsGuard.reset();
        frame = requestAnimationFrame(animate);
      }
    }

    /**
     * Update focus and camera targets from pointer coordinates.
     */
    function updatePointer(event: PointerEvent) {
      const x = THREE.MathUtils.clamp(
        (event.clientX / window.innerWidth) * 2 - 1,
        -1,
        1
      );
      const y = THREE.MathUtils.clamp(
        (event.clientY / window.innerHeight) * 2 - 1,
        -1,
        1
      );
      pointer.set(x, -y); // Coordenadas de pantalla para el raycaster.
      pointerInside = true;
      focusDirty = true;

      // En móvil el toque sólo controla el DOF; el giro viene del sensor.
      if (!isMobile && event.pointerType === 'mouse')
        target.set(x, y).clampLength(0, 1).multiplyScalar(maxAngle);
      requestMotion();
    }

    window.addEventListener('pointerdown', (event) => {
      updatePointer(event);
      void requestGyroscopePermission();
    }, { signal });
    window.addEventListener('pointermove', updatePointer, { signal });

    /**
     * Restore the desktop camera target when interaction ends.
     */
    function resetMotion() {
      pointerInside = false;
      if (!isMobile) target.set(0, 0);
      requestMotion();
    }
    document.documentElement.addEventListener('pointerleave', resetMotion, { signal });
    window.addEventListener('blur', resetMotion, { signal });
    document.addEventListener('visibilitychange', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previousTime = null;
      fpsGuard.reset();
      if (!document.hidden) {
        gyroHasOrigin = false;
        requestMotion();
      }
    }, { signal });
    screenOrientation?.addEventListener('change', () => {
      gyroHasOrigin = false;
    }, { signal });

    // Conserva la altura del encuadre de la cámara ortográfica original.
    const halfHeight = camera instanceof THREE.OrthographicCamera
      ? (camera.top - camera.bottom) / 2
      : 0;

    /**
     * Resize render targets and preserve the exported camera framing.
     */
    function resize() {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const aspect = width / height;
      // false evita que Three.js sobrescriba el tamaño CSS del canvas. Si no se hace así, el canvas se estira y la imagen se deforma.
      renderer.setSize(width, height, false);
      composer.setSize(width, height);

      if (camera instanceof THREE.OrthographicCamera) {
        camera.left = -halfHeight * aspect;
        camera.right = halfHeight * aspect;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
      } else {
        camera.aspect = aspect;
      }
      camera.updateProjectionMatrix();
      focusDirty = true;
      pickFocus();
      renderScene();
      // Reveal the canvas only after a successful render at its actual size.
      container.classList.add('scene-ready');
      requestMotion();
    }

    window.addEventListener('resize', resize, { signal });
    resize();
    // Solo se mueve la cámara: reutiliza las sombras calculadas al cargar.
    renderer.shadowMap.autoUpdate = false;
    const overlay = container.querySelector<HTMLElement>('#scene-overlay');
    if (overlay) overlay.style.display = 'block';
  } catch (error) {
    if (state.disposed) return;
    release();
    console.error(error);
  }
}

document.addEventListener('astro:before-swap', () => {
  cleanupScene?.();
  cleanupScene = undefined;
});
document.addEventListener('astro:page-load', () => {
  void (async () => {
    try {
      await initScene();
    } catch (error) {
      console.error(error);
    }
  })();
});
