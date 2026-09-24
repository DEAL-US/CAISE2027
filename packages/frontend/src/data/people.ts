import type { ImageMetadata } from 'astro';
import Adela from '#/assets/images/people/ortega.jpg';
import BediliaEstrada from '#/assets/images/people/BEstradaTorres.png';
import ManuelResinas from '#/assets/images/people/resinas.jpg';
import CristinaCabanillas from '#/assets/images/people/Cristina_Cabanillas.png';
import EstefaniaSerral from '#/assets/images/people/Estefania_Serral.jpg';
import FernandoFernandez from '#/assets/images/people/FernandoFernandez.jpg';
import CarlosCapitan from '#/assets/images/people/CarlosCapitan.jpg';
import AntonioRuizCortes from '#/assets/images/people/Ruiz-Cortes-Antonio.jpeg';
import MaribelSantos from '#/assets/images/people/SANTOS-MARIBEL.jpg';
import MassimoMecella from '#/assets/images/people/MECELLA-MASSIMO.jpg';
import InmaHernandez from '#/assets/images/people/HERNANDEZ-SALMERON-INACULADA-C.jpg';
import DanielAyala from '#/assets/images/people/AYALA-HERNANDEZ-DANIEL.jpg';
import JanisStirna from '#/assets/images/people/STIRNA-JANIS.jpg';
import AndreaBurattin from '#/assets/images/people/BURATTIN-ANDREA.webp';
import KawtarBenghazi from '#/assets/images/people/BENGHAZI-KAWTAR.jpg';
import ArikSenderovich from '#/assets/images/people/SENDEROVICH-ARIK.jpg';
import SchahramDustdar from '#/assets/images/people/DUSTDAR-SCHAHRAM.jpg';
import PaoloGiorgini from '#/assets/images/people/GIORGINI-PAOLO.jpg';
import DominikBork from '#/assets/images/people/BORK-DOMINIK.jpg';
import MariteKirikova from '#/assets/images/people/KIRIKOVA-MARITE.jpg';
import FrancescoLeotta from '#/assets/images/people/LEOTTA-FRANCESCO.png';
import GiancarloGuizzardi from '#/assets/images/people/GUIZZARDI-GIANCARLO.jpg';
import ManuelWimmer from '#/assets/images/people/WIMMER-MANUEL.jpg';
import JoseCalderon from '#/assets/images/people/CALDERON-JOSE.jpg';
import DanielRuiz from '#/assets/images/people/Daniel_Ruiz.png';
import MariaJoseEscalona from '#/assets/images/people/Maria_Jose_Escalona.jpg';
import FlaviaMonti from '#/assets/images/people/Flavia-Monti.webp';
import GiovanniMeroni from '#/assets/images/people/Giovanni-Meroni.webp';
import DjordjeDjurica from '#/assets/images/people/Djordje_Djurica.jpg';
import TianwaChen from '#/assets/images/people/Tianwa_Chen.jpg';
import IstvanDavid from '#/assets/images/people/Istvan_David.jpg';
import AndreaDelgado from '#/assets/images/people/Andrea_Delgado.jpg';


import type { Testimonial } from '#/types';

interface ConferenceMember {
  treatment?: string;
  job?: string;
  image?: ImageMetadata;
  institution?: string;
  location?: string;
  //email?: string;
  /** Full URL to the person's Google Scholar profile. */
  scholar?: string;
  bio?: string;
}

const USData = {
  institution: 'University of Seville',
  location: 'Spain'
};

/**
 * Same institution as above, but listed without the city, which is how the
 * chairs holding a non-local role are credited.
 */
const USDataNoCity = {
  institution: 'University of Seville',
  location: 'Spain'
};

const sharedPeopleData = {
  'Adela del Río Ortega': {
    scholar: 'https://scholar.google.es/citations?hl=es&user=Al0vo7sAAAAJ',
    image: Adela,
    ...USDataNoCity,
    //email: 'adeladelrio@us.es'
  },
  'Manuel Resinas': {
    scholar: 'https://scholar.google.es/citations?hl=es&user=Wjzs3WoAAAAJ',
    ...USDataNoCity,
    image: ManuelResinas
  },
  'Cristina Cabanillas': {
    scholar: 'https://scholar.google.es/citations?user=DWEkhicAAAAJ&hl=es&oi=ao',
    image: CristinaCabanillas,
    ...USData,
    //email: 'cristinacabanillas@us.es'
  },
  'Bedilia Estrada Torres': {
    scholar: 'https://scholar.google.es/citations?hl=es&user=1bPY9SYAAAAJ',
    ...USData,
    image: BediliaEstrada,
    //email: 'iestrada@us.es'
  },
  'Carlos Capitán Agudo': {
    ...USData,
    image: CarlosCapitan,
    //email: 'ccagudo@us.es'
  }
} satisfies Record<string, ConferenceMember>;

/**
 * This type also ensures that IntelliSense is provided for the shared people's keys.
 */
type ConferenceMemberData = Partial<Record<keyof typeof sharedPeopleData, ConferenceMember>> & Record<string, ConferenceMember>;

/** Shared contact addresses shown below the corresponding committee heading. */
export const conferenceCommitteeContacts: Record<string, string> = {
  'General chairs': 'caise2027@easychair.org',
  'Program chairs': 'caise2027-main@easychair.org',
  Workshops: 'caise2027-workshops@easychair.org',
  Tutorials: 'caise2027-tutorials@easychair.org',
  Panels: 'caise2027-panels@easychair.org',
  'Doctoral Consortium': 'caise2027-dc@easychair.org',
  Forum: 'caise2027-forum@easychair.org'
};

export const conferenceChairs = (): Record<string, ConferenceMemberData> => ({
  'General chairs': {
    'Cristina Cabanillas': sharedPeopleData['Cristina Cabanillas'],
    'Antonio Ruiz Cortés': {
      scholar: 'https://scholar.google.es/citations?user=Ka-FHBQAAAAJ&hl=es&oi=ao',
      ...USData,
      image: AntonioRuizCortes,
      //email: 'aruiz@us.es'
    }
  },
  'Program chairs': {
    'Massimo Mecella': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=x844E6sAAAAJ',
      image: MassimoMecella,
      institution: 'Sapienza Università di Roma',
      location: 'Italy'
    },
    'Maribel Yasmina Santos': {
      scholar: 'https://scholar.google.es/citations?user=wmG-0k0AAAAJ&hl=es&oi=ao',
      image: MaribelSantos,
      institution: 'University of Minho',
      location: 'Portugal'
    }
  },
  'Local Organising': {
    'Inma Hernández': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=nThy9VsAAAAJ',
      ...USData,
      image: InmaHernandez,
      //email: 'inmahernandez@us.es'
    },
    'Daniel Ayala': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=Pv2WnYAAAAAJ',
      ...USData,
      image: DanielAyala,
      //email: 'dayala1@us.es'
    }
  },
  'Workshops': {
    'Janis Stirna': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=8aR_MtEAAAAJ',
      image: JanisStirna,
      institution: 'University of Stockholm',
      location: 'Sweden'
    },
    'Andrea Burattin': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=gaiAPWYAAAAJ',
      image: AndreaBurattin,
      institution: 'Technical University of Denmark',
      location: 'Denmark'
    },
    'Kawtar Benghazi': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=jobOUSsAAAAJ',
      image: KawtarBenghazi,
      institution: 'University of Granada',
      location: 'Spain'
    }
  },
  'Tutorials': {
    'Arik Senderovich': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=89TT1cgAAAAJ',
      image: ArikSenderovich,
      institution: 'York University',
      location: 'Canada'
    },
    'Estefanía Serral Asensio': {
      scholar: 'https://scholar.google.es/citations?user=5YyRdNEAAAAJ&hl=es&oi=ao',
      image: EstefaniaSerral,
      institution: 'KU Leuven',
      location: 'Belgium'
    }
  },
  'Panels': {
    'Manuel Resinas': sharedPeopleData['Manuel Resinas'],
    'Schahram Dustdar': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=0n5S6uUAAAAJ',
      image: SchahramDustdar,
      institution: 'TU Wien',
      location: 'Austria'
    }
  },
  'Doctoral Consortium': {
    'Paolo Giorgini': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=ulB0WtkAAAAJ',
      image: PaoloGiorgini,
      institution: 'University of Trento',
      location: 'Italy'
    },
    'Adela del Río Ortega': sharedPeopleData['Adela del Río Ortega'],
    'Dominik Bork': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=tp-fFq0AAAAJ',
      image: DominikBork,
      institution: 'TU Wien',
      location: 'Austria'
    }
  },
  'Forum': {
    'Marite Kirikova': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=XSP8XvsAAAAJ',
      image: MariteKirikova,
      institution: 'Riga Technical University',
      location: 'Latvia'
    },
    'Francesco Leotta': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=Z216gywAAAAJ',
      image: FrancescoLeotta,
      institution: 'Sapienza Università di Roma',
      location: 'Italy'
    }
  },
  'Journal First': {
    'Giancarlo Guizzardi': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=nnfVBt8AAAAJ',
      image: GiancarloGuizzardi,
      institution: 'University of Twente',
      location: 'Netherlands'
    }
  },
  'Research Projects Exhibition': {
    'María José Escalona': {
      scholar: 'https://scholar.google.es/citations?user=30qXvJMAAAAJ&hl=es&oi=ao',
      image: MariaJoseEscalona,
      institution: 'University of Seville',
      location: 'Spain'
    }
  },
  'Proceedings chairs': {
    'Flavia Monti': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=PegkmvcAAAAJ',
      image: FlaviaMonti,
      institution: 'Sapienza Università di Roma',
      location: 'Italy'
    },
    'Giovanni Meroni': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=YSjeTXEAAAAJ',
      image: GiovanniMeroni,
      institution: "Università degli Studi dell'Insubria",
      location: 'Italy'
    },
    'Bedilia Estrada Torres': {
      ...sharedPeopleData['Bedilia Estrada Torres'],
      ...USDataNoCity
    }
  },
  'PhD Awards': {
    'Manuel Wimmer': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=YZDY1psAAAAJ',
      image: ManuelWimmer,
      institution: 'JKU Linz',
      location: 'Austria'
    }
  },
  'Web and Social Media': {
    'José Calderón': {
      ...USDataNoCity,
      image: JoseCalderon
    },
    'Daniel Ruiz López': {
      ...USData,
      //email: 'druiz7@us.es',
      image: DanielRuiz
    },
    'Fernando Fernández': {
      ...USData,
      //email: 'ferferga@us.es',
      image: FernandoFernandez
    }
  },
  /**
   * The four members without an institution or an email are pending: only
   * their country is confirmed so far.
   */
  'Publicity': {
    'Djordje Djurica': {
      scholar: 'https://scholar.google.es/citations?hl=es&user=jjrLeQIAAAAJ',
      image: DjordjeDjurica,
      institution: 'University of Economics and Business',
      location: 'Austria'
    },
    'Andrea Delgado': {
      scholar: 'https://scholar.google.es/citations?user=1q26cxcAAAAJ&hl=es&oi=sra',
      image: AndreaDelgado,
      institution: 'University of the Republic',
      location: 'Uruguay'
    },
    'Tianwa Chen': {
      scholar: 'https://scholar.google.es/citations?user=AhGeJUcAAAAJ&hl=es&oi=ao',
      image: TianwaChen,
      institution: 'University of the Sunshine Coast',
      location: 'Australia'
    },
    'Carlos Capitán Agudo': sharedPeopleData['Carlos Capitán Agudo'],
    'Istvan David': {
      scholar: 'https://scholar.google.es/citations?user=NsRgDcUAAAAJ&hl=es&oi=ao',
      image: IstvanDavid,
      institution: 'McMaster University',
      location: 'Canada'
    }
  }
});

/**
 * Converts the data of a conference member to a testimonial object,
 * to be used inside Testimonials components
 */
export function toTestimonial(
  name: string,
  m: ConferenceMember,
  {
    includeTreatment = true,
    includeTestimonial = true
  }
): Testimonial {
  const classes = {
    panel: 'mt-3'
  };

  return {
    name: m.treatment && includeTreatment ? `${m.treatment} ${name}` : name,
    job: m.job,
    testimonial: includeTestimonial ? m.bio : undefined,
    items: [
      ...(m.institution
        ? ([{
            icon: 'i-mdi:university',
            description: m.institution,
            classes
          } as const])
        : []),
      ...(m.location
        ? ([{
            icon: 'i-hugeicons:globe',
            description: m.location,
            classes
          } as const])
        : []),
      ...(m.email
        ? ([{
            icon: 'i-tabler:mail',
            description: `<a href="mailto:${m.email}" class="underline">${m.email}</a>`,
            classes
          } as const])
        : [])
    ],
    profiles: [
      /* The icon name is spelled out here so UnoCSS emits it. */
      ...(m.scholar
        ? ([{
            icon: 'i-academicons:google-scholar',
            href: m.scholar,
            label: 'Google Scholar'
          } as const])
        : [])
    ],
    ...(m.image && ({
      image: {
        src: m.image,
        alt: name
      }
    }))
  };
}
