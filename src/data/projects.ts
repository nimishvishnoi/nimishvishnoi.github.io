/**
 * Projects data
 */
import type { Project } from '@types';

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'ESI Synthesis',
    year: 2020,
    category: 'app',
    description:
      'A logistics and commercial application used by Oil and Gas companies to manage their entire order-to-cash cycle. Designed for scalability and high performance.',
    technologies: ['C#', 'ASP.NET', 'SQL Server', 'JavaScript'],
  },
  {
    id: 'proj-2',
    title: 'L & L Automotive',
    year: 2019,
    category: 'web',
    description:
      'Website to show vehicles based on model. Full-stack development with responsive design and user-friendly interface. Deployed on corporate network.',
    technologies: ['.NET MVC', 'jQuery', 'SQL Server'],
    url: 'corporate.landlautomotive.co.uk',
  },
  {
    id: 'proj-3',
    title: 'Bizzalley',
    year: 2019,
    category: 'card',
    description:
      'Web App to help businesses connect with customers and process inquiries seamlessly. Real-time communication and data management.',
    technologies: ['.NET MVC', 'API', 'Firebase', 'JavaScript', 'SQL Server'],
    url: 'bizzalley.azurewebsites.net',
  },
  {
    id: 'proj-4',
    title: 'ClicFlyer',
    year: 2018,
    category: 'app',
    description:
      'Website to manage flyers and promotional offers. Built with modern web technologies and responsive design principles.',
    technologies: ['.NET MVC', 'API', 'jQuery', 'SQL Server'],
    url: 'clicflyer.com',
  },
  {
    id: 'proj-5',
    title: 'Anomaly Detection in Data Center',
    year: 2018,
    category: 'app',
    description:
      'Advanced machine learning project to identify unexpected items or events in datasets using unsupervised learning algorithms.',
    technologies: ['Python', 'Machine Learning', 'Data Analysis'],
  },
  {
    id: 'proj-6',
    title: 'MAC Verification App',
    year: 2017,
    category: 'app',
    description:
      'Android application that verifies MAC Address of user devices against database. Built to prevent unauthorized distribution.',
    technologies: ['Android', 'PHP', 'MySQL', 'API', 'Bootstrap'],
  },
  {
    id: 'proj-7',
    title: 'College Fest Website',
    year: 2017,
    category: 'web',
    description:
      'Website for college annual fest with event registration and information management. Built from scratch with full functionality.',
    technologies: ['PHP', 'JavaScript', 'MySQL', 'Bootstrap'],
  },
  {
    id: 'proj-8',
    title: 'BBMS - Blood Bank Management System',
    year: 2017,
    category: 'app',
    description:
      'Java application to help blood bank administrators manage stock and donor/receiver information. Both desktop and web versions.',
    technologies: ['Java', 'MySQL'],
  },
];
