import { 
  faHome, 
  faGraduationCap, 
  faUserTie,
  faClipboardList,
  faUsers,
  faClock,
  faCalendarAlt,
  faBookOpen,
  faUserGraduate,
  faFileAlt,
  faChalkboardTeacher,
  faTrophy,
  faPencilAlt,
  faCode,
  faUserPlus,
  faListAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavItem {
  title: string;
  url?: string;
  icon?: IconDefinition;
  items?: NavItem[]; 
}

interface NavSection {
  label?: string;
  icon?: IconDefinition;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    icon: faHome,
    items: [
      {
        title: "Dashboard",
        url: "/",
        items: [],
        icon: faHome,
      }
    ]
  },
  {
    label: "ENSEIGNEMENT",
    items: [
      {
        title: 'Promotions',
        icon: faGraduationCap,
        items: [
          {
            title: 'Promotion',
            url: '/promotions'
          },
          {
            title: 'Unité d\'Enseignement',
            url: '/promotions/ue'
          },
          {
            title: 'Matières',
            url: '/promotions/matieres'
          }
        ]
      },
      {
        title: 'Titulaires',
        icon: faChalkboardTeacher,
        url: '/enseignants',
        items: []
      }
    ]
  },
  {
    label: "RESULATATS",
    items: [
      {
        title: 'Jurys',
        icon: faTrophy,
        url: '/jurys',
        items: []
      },
      {
        title: 'Enrolement',
        icon: faUserPlus,
        items: [],
        url: '/enrollements'
      }
    ]
  },
  // {
  //   label: "APPARITORAT",
  //   items: [
  //     {
  //       title: 'Inscriptions',
  //       icon: faClipboardList,
  //       items: [],
  //       url: '/etudiants/inscriptions'
  //     },
  //     {
  //       title: 'Promotion des étudiants',
  //       icon: faUserGraduate,
  //       items: [],
  //       url: '/etudiants/promotion'
  //     }
  //   ]
  // }
];
