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
      'A logistics and commercial application used by Oil and Gas companies to manage their entire order-to-cash cycle.',
    technologies: ['C#', 'ASP.Net', 'SQL Server', 'JavaScript'],
  },
  {
    id: 'proj-2',
    title: 'L & L Automotive',
    year: 2019,
    category: 'web',
    description:
      'Automotive catalog website for browsing and filtering vehicles by model, built during my time at Wildnet using .NET MVC.',
    technologies: ['.Net MVC', 'jQuery', 'SQL Server'],
  },
  {
    id: 'proj-3',
    title: 'Bizzalley',
    year: 2019,
    category: 'web',
    description:
      'Customer engagement platform that helps businesses connect with prospects and manage customer inquiries.',
    technologies: ['.Net MVC', 'API', 'Firebase', 'JavaScript', 'SQL Server'],
  },
  {
    id: 'proj-4',
    title: 'ClicFlyer',
    year: 2018,
    category: 'web',
    description:
      'Flyer and promotional-offer management platform developed at Wildnet using .NET MVC.',
    technologies: ['.Net MVC', 'API', 'jQuery', 'SQL Server'],
  },
  {
    id: 'proj-5',
    title: 'Anomaly Detection in Data Center',
    year: 2018,
    category: 'app',
    description:
      'The aim of project was to identify unexpected items or events in datasets using unsupervised learning algorithms.',
    technologies: ['Python', 'Machine Learning'],
  },
  {
    id: 'proj-6',
    title: 'MAC Verification App',
    year: 2017,
    category: 'app',
    description:
      'Android application that verifies a device MAC address against a backend database to prevent unauthorized app distribution.',
    technologies: ['Android', 'PHP', 'MySQL', 'API', 'BootStrap'],
  },
  {
    id: 'proj-7',
    title: 'College Fest Website',
    year: 2017,
    category: 'web',
    description:
      'Website for the Gyan Jyoti annual college fest, used for event registration and publishing schedules and event details.',
    technologies: ['PHP', 'JavaScript', 'MySQL', 'BootStrap'],
  },
  {
    id: 'proj-8',
    title: 'BBMS',
    year: 2017,
    category: 'app',
    description:
      'Blood bank management system for maintaining stock and donor/receiver records, delivered as both desktop and web applications.',
    technologies: ['Java', 'MySQL'],
  },
];
