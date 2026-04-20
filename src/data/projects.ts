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
    description: 'A logistics and commercial application used by Oil and Gas companies to manage their entire order-to-cash cycle.',
    technologies: ['C#', 'ASP.Net', 'SQL Server', 'JavaScript'],
  },
  {
    id: 'proj-2',
    title: 'L & L Automotive',
    year: 2019,
    category: 'web',
    description: 'Website to show the vehicles based on model. Worked on this project at Wildnet in .Net MVC.',
    technologies: ['.Net MVC', 'jQuery', 'SQL Server'],
  },
  {
    id: 'proj-3',
    title: 'Bizzalley',
    year: 2019,
    category: 'web',
    description: 'Web App to help business connect with customers and let the customers to inquiry.',
    technologies: ['.Net MVC', 'API', 'Firebase', 'JavaScript', 'SQL Server'],
  },
  {
    id: 'proj-4',
    title: 'ClicFlyer',
    year: 2018,
    category: 'web',
    description: 'Website to manage flyers and its offers in it. Worked on this project in Wildnet using .Net MVC.',
    technologies: ['.Net MVC', 'API', 'jQuery', 'SQL Server'],
  },
  {
    id: 'proj-5',
    title: 'Anomaly Detection in Data Center',
    year: 2018,
    category: 'app',
    description: 'The aim of project was to identify unexpected items or events in datasets using unsupervised learning algorithms.',
    technologies: ['Python', 'Machine Learning'],
  },
  {
    id: 'proj-6',
    title: 'MAC Verification App',
    year: 2017,
    category: 'app',
    description: 'It is Android application which verify the MAC Address of the user device and check with the database, this application is developed to stop unauthorized distribution of that application.',
    technologies: ['Android', 'PHP', 'MySQL', 'API', 'BootStrap'],
  },
  {
    id: 'proj-7',
    title: 'College Fest Website',
    year: 2017,
    category: 'web',
    description: 'It is a Website for my college annual fest Gyan Jyoti used for registration of events and it contains all the information regarding all the events and their timing.',
    technologies: ['PHP', 'JavaScript', 'MySQL', 'BootStrap'],
  },
  {
    id: 'proj-8',
    title: 'BBMS',
    year: 2017,
    category: 'app',
    description: 'It is a Java App which help the blood bank administrator to manage the stock of the blood. Here the administrator can fill all the basic information of Donor and Receiver. Developed Desktop and Web App.',
    technologies: ['Java', 'MySQL'],
  },
];
