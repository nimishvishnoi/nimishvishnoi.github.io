/**
 * Experience data
 */
import type { Experience } from '@types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Associate Staff Engineer',
    company: 'Nagarro',
    location: 'Noida, IN',
    startDate: new Date(2021, 10), // November 2021
    endDate: null, // Current
    description: [
      'Created a vehicle showcase website with dynamic data loading and seamless integration. Delivered project objectives on time, enhancing user experience.',
      'Developed a promotional website, improved functionality, and optimized performance using C#, .NET Framework, SQL Server, JavaScript, and jQuery.',
      'Contributed to developing Provision, a used car management solution, using C#, .NET, React JS, Stencil JS, and AWS.',
      'Led HRMS portal enhancements independently, streamlining operations and earning commendations for improved usability. Played a pivotal role in enhancing efficiency and task organization.',
    ],
    technologies: ['C#', 'React', 'AWS', 'TypeScript', 'SQL Server', 'Stencil JS'],
  },
  {
    id: 'exp-2',
    title: 'Junior System Analyst',
    company: 'Contata Solution',
    location: 'Noida, IN',
    startDate: new Date(2020, 0), // January 2020
    endDate: new Date(2021, 10), // November 2021
    description: [
      'Worked as .Net Developer for ESI Synthesis in the Oil & Gas domain',
      'Used C#, SQL Server, JavaScript, and jQuery for project requirements',
      'Spearheaded a Proof of Concept (POC) project in Angular',
      'Contributed to the development and maintenance of software systems tailored to the Oil & Gas industry',
    ],
    technologies: ['C#', 'SQL Server', 'JavaScript', 'jQuery', 'Angular'],
  },
  {
    id: 'exp-3',
    title: 'Junior Software Engineer',
    company: 'Wildnet Technologies',
    location: 'Noida, IN',
    startDate: new Date(2018, 7), // August 2018
    endDate: new Date(2019, 10), // November 2019
    description: [
      '.NET Developer specializing in e-commerce platforms',
      'Used C#, .NET Framework, SQL Server, JavaScript, jQuery, Firebase, and Azure',
      'Contributed to enhancing and optimizing e-commerce applications',
      'Led project development and deployment, optimizing efficiency.',
      'Managed AWS cloud infrastructure for effective project support.',
      'Oversaw microservices monitoring for reliability.',
      'Utilized .NET, C#, React.js, AWS, and more for high-quality solutions.',
    ],
    technologies: [
      'C#',
      '.NET Framework',
      'SQL Server',
      'JavaScript',
      'jQuery',
      'Firebase',
      'Azure',
      'AWS',
      'React.js',
    ],
  },
];
