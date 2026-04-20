/**
 * Experience data
 */
import type { Experience } from '@types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Senior Engineer',
    company: 'Nagarro',
    location: 'Noida, IN',
    startDate: new Date(2021, 10), // November 2021
    endDate: null, // Current
    description: [
      'Led development of high-performance web applications using React and AWS',
      'Architected and implemented microservices solutions using C#',
      'Mentored junior developers and conducted code reviews',
      'Optimized application performance resulting in 40% improvement',
    ],
    technologies: ['C#', 'React', 'AWS', 'TypeScript', 'SQL Server'],
  },
  {
    id: 'exp-2',
    title: 'Junior System Analyst',
    company: 'Contata Solution',
    location: 'Noida, IN',
    startDate: new Date(2020, 0), // January 2020
    endDate: new Date(2021, 10), // November 2021
    description: [
      'Worked as .Net Developer for ESI Synthesis - a logistics and commercial application',
      'Worked on Oil & Gas domain projects',
      'Developed and maintained web applications using .NET Framework',
      'Collaborated with cross-functional teams to deliver solutions on time',
    ],
    technologies: ['C#', 'SQL Server', 'JavaScript', 'jQuery', '.NET Framework'],
  },
  {
    id: 'exp-3',
    title: 'Junior Software Engineer',
    company: 'Wildnet Technologies',
    location: 'Noida, IN',
    startDate: new Date(2018, 7), // August 2018
    endDate: new Date(2019, 10), // November 2019
    description: [
      'Worked as .Net Developer for Web Applications',
      'Majorly worked on Ecommerce based applications',
      'Implemented responsive UI using JavaScript and jQuery',
      'Database design and optimization for scalability',
    ],
    technologies: [
      'C#',
      '.NET Framework',
      'SQL Server',
      'JavaScript',
      'jQuery',
      'Firebase',
      'Azure',
    ],
  },
];
