import type { ImageMetadata } from 'astro';
import Adela from '#/assets/images/people/ortega.jpg';
import BediliaEstrada from '#/assets/images/people/BEstradaTorres.png';
import ManuelResinas from '#/assets/images/people/resinas.jpg';
import CristinaCabanillas from '#/assets/images/people/Cristina_Cabanillas.png';
import EstefaniaSerral from '#/assets/images/people/Estefania_Serral.jpg';
import FernandoFernandez from '#/assets/images/people/FernandoFernandez.jpg';
import CarlosCapitan from '#/assets/images/people/CarlosCapitan.jpg';

import type { Testimonial } from '#/types';

interface ConferenceMember {
  treatment?: string;
  job?: string;
  image?: ImageMetadata;
  institution?: string;
  location?: string;
  email?: string;
  bio?: string;
}

const treatment = 'Prof. Dr.';
const USData = {
  institution: 'University of Seville',
  location: 'Seville, Spain'
};

const sharedPeopleData = {
  'Adela del Río Ortega': {
    treatment,
    image: Adela,
    ...USData,
    email: 'adeladelrio@us.es',
    bio: `
      Adela del Río Ortega is a professor at Universidad de Sevilla and a member of the ISA Research group,
      where she initiated the Business Process Management research line with her PhD thesis.
      She serves on the Steering Committee of the BPM conference and is known for her work on process performance indicators (PPIs)
      and their automatic analysis. Her current research interests include process performance management,
      RPA and personal productivity analytics. With over 50 publications in top computer science and information systems outlets,
      she has developed two registered software tools valued at over €60k and participated in more than 10 externally funded projects.
      She has also collaborated with various IT companies as a consultant and researcher.
    `
  },
  'Manuel Resinas': {
    ...USData,
    image: ManuelResinas,
    email: 'resinas@us.es',
    bio: `
      Manuel Resinas is a Professor at the University of Seville, where he leads the Information Systems 
      group in the Smart Computer Systems Research and Engineering lab. His current research interests 
      include process performance and compliance management, personal productivity analytics, and the 
      process of process mining. Previously, he worked on the analysis and management of service level 
      agreements. His research is regularly published in journals like IEEE Trans. Serv. Comp. or BISE, 
      and conferences like BPM or CAiSE. He has been general chair and PC chair of the BPM conference, 
      and is currently associate editor in the BISE journal.        
    `
  },
  'Cristina Cabanillas': {
    image: CristinaCabanillas,
    ...USData,
    email: 'cristinacabanillas@us.es',
    job: 'Track II chair',
    bio: `
      Cristina Cabanillas is a Professor at the University of Seville and a member of the Information Systems group in the SCORE lab.
      She worked for seven years at WU Vienna, where she got the Habilitation. She has coordinated three research projects and
      a technology transfer project of competitive Austrian and Spanish calls. Her current research interests include
      resource management in business processes; process mining, with a focus on easing process mining analysis tasks;
      and business process compliance. She has over 70 academic publications and two registered software tools,
      she has chaired a number of tracks and workshops in top international conferences, she has given invited talks in
      international institutions, and she has collaborated with the Spanish public administration, national and
      international companies.
    `
  },
  'Bedilia Estrada Torres': {
    ...USData,
    image: BediliaEstrada,
    email: 'iestrada@us.es',
    bio: `
      Bedilia Estrada Torres is an assistant professor at the Department of Languages and Computer Systems
      and a member of the ISA Research Group at the University of Seville, Spain.
      She received her international PhD in Computer Engineering in 2018.
      Her research interests include business process management, the analysis, modeling, and management
      of process performance indicators in different scenarios, such as structured processes,
      variability in process families, knowledge-intensive processes, their relationship with
      decision-making processes, and the use of chatbots in process management. Bedilia collaborated and
      conducted research stays in Brazil and Estonia and has participated in more than ten Spanish and
      European research, development, and innovation projects. She serves as a program committee member
      in business process management conferences and as a peer reviewer in scientific journals.
    `
  },
  'Carlos Capitán Agudo': {
    ...USData,
    image: CarlosCapitan,
    email: 'ccagudo@us.es',
    bio: `
      Carlos Capitán-Agudo is a graduate in health engineering, and he received a MSc in software engineering at the University of Seville.
      For his final degree work, he was awarded in the national competition XVIII “Arquimedes” of introduction to scientific research.
      Currently, he is a PhD student at the University of Seville. His thesis aims to facilitate time performance analyses in process mining,
      and it is under the supervision of Manuel Resinas, and Cristina Cabanillas. He has co-authored publications in conferences such as
      BPMNDS, BPM, and ICSOC. One of the publications he co-authored received the Best Student Paper Award at BPM 2022.
      His current research interests include process performance, neuronal networks, and explainable artificial intelligence.
    `
  }
} satisfies Record<string, ConferenceMember>;

/**
 * This type also ensures that IntelliSense is provided for the shared people's keys.
 */
type ConferenceMemberData = Partial<Record<keyof typeof sharedPeopleData, ConferenceMember>> & Record<string, ConferenceMember>;

export const conferenceChairs = (): Record<string, ConferenceMemberData> => ({
  'General chairs': {
    'Cristina Cabanillas': sharedPeopleData['Cristina Cabanillas'],
    'Antonio Ruiz Cortés': {
      ...USData
    }
  },
  'Program chairs': {
    'Maribel Santos': {
      location: 'Portugal'
    }
  },
  'Local Organising': {
    'Inmaculada Hernández': {
      ...USData
    },
    'Daniel Ayala': {
      ...USData
    }
  },
  'Workshops': {
    'Janis Stirna': {
      location: 'Sweden'
    },
    'Andrea Burattin': {
      location: 'Denmark'
    },
    'Kawtar Benghazi': {
      location: 'Spain'
    }
  },
  'Tutorials': {
    'Arik Senderovich': {
      location: 'Canada'
    },
    'Estefanía Serral Asensio': {
      image: EstefaniaSerral,
      institution: 'KU Leuven',
      location: 'Leuven, Belgium',
      email: 'estefania.serralasensio@kuleuven.be',
      bio: `
        Estefanía Serral is an Associate Professor at KU Leuven (Belgium). She has a highly international and
        interdisciplinary profile. Her research center in improving businesses and societal challenges using
        the Internet of Things in combination with Business Process Management and/or data analytics.
        In 2018, she was also an Assistant professor at TU/e, The Netherlands. From 2012 to 2014, she led the
        Semantic Knowledge Representation and Integration research group at the CDL-Lab
        at the Technical University of Vienna (Austria). Until 2012, she worked in the ProS Research Center
        at the Technical University of Valencia (Spain), where she designed a novel method for developing
        ubiquitous systems using Model-Driven Development (MDD) and Semantic technologies.
        Prof. Serral has many publications in high-ranking conferences and journals,
        such as CAiSE, ER, UIC, PMC, ESWA, SOSYM, MTAP, etc.
        She completed her PhD in Computer science in 2011; a Master Degree on Software Engineering,
        Formal Methods and Information Systems in 2008; and a bachelor degree in Computer science in 2006.
      `
    }
  },
  'Panels': {
    'Manuel Resinas': sharedPeopleData['Manuel Resinas'],
    'Schahram Dustdar': {
      location: 'Austria'
    }
  },
  'Doctoral Consortium': {
    'Paolo Giorgini': {
      location: 'Italy'
    },
    'Adela del Río Ortega': sharedPeopleData['Adela del Río Ortega'],
    'Dominik Bork': {
      location: 'Austria'
    }
  },
  'Forum': {
    'Marite Kirikova': {
      location: 'Latvia'
    },
    'Francesco Leotta': {
      location: 'Italy'
    }
  },
  'Journal First': {
    'María Teresa Gómez-López': {
      location: 'Spain'
    },
    'Giancarlo Guizzardi': {
      location: 'Netherlands'
    }
  },
  'Awards & Communications': {
    'Manuel Wimmer': {
      location: 'Austria'
    },
    'Fernando Fernández': {
      ...USData,
      email: 'ferferga@us.es',
      image: FernandoFernandez,
      job: 'Web'
    },
    'Bedilia Estrada Torres': {
      ...sharedPeopleData['Bedilia Estrada Torres'],
      job: 'Social Media'
    },
    'Carlos Capitán Agudo': {
      ...sharedPeopleData['Carlos Capitán Agudo'],
      job: 'Publicity'
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
    ...(m.image && ({
      image: {
        src: m.image,
        alt: name
      }
    }))
  };
}
