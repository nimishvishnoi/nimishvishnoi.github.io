/**
 * Experience data
 */
import type { Experience } from '@types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Staff Engineer',
    company: 'Nagarro',
    location: 'Noida, Uttar Pradesh, India',
    startDate: new Date(2025, 6), // July 2025
    endDate: null, // Current
    description: [
      'Provide technical leadership for enterprise web solutions and guide architecture decisions.',
      'Drive scalable implementation using C#, .NET, React, AWS, and delivery automation practices.',
      'Mentor engineers through reviews, technical direction, and maintainability standards.',
      'Partner with stakeholders and engineering teams to deliver high-impact product increments.',
    ],
    technologies: ['C#', '.NET', 'React', 'AWS', 'GitHub Actions', 'Terraform', 'SQL Server'],
  },
  {
    id: 'exp-2',
    title: 'Associate Staff Engineer',
    company: 'Nagarro',
    location: 'Noida, Uttar Pradesh, India',
    startDate: new Date(2023, 9), // October 2023
    endDate: new Date(2025, 6), // July 2025
    description: [
      'Delivered business-critical enhancements with strong emphasis on reliability and code quality.',
      'Built full-stack capabilities across .NET backend services and React frontends.',
      'Improved delivery confidence through CI/CD practices, automation, and technical reviews.',
      'Supported team execution through design guidance and hands-on implementation.',
    ],
    technologies: ['C#', '.NET', 'React', 'AWS', 'GitHub Actions', 'SQL Server'],
  },
  {
    id: 'exp-3',
    title: 'Senior Engineer',
    company: 'Nagarro',
    location: 'Noida, Uttar Pradesh, India',
    startDate: new Date(2021, 10), // November 2021
    endDate: new Date(2023, 9), // October 2023
    description: [
      'Built and optimized customer-facing web solutions using C#, .NET, SQL Server, JavaScript, and React.',
      'Contributed to used-car management and HRMS initiatives with strong delivery ownership.',
      'Improved usability and operational efficiency through targeted feature and performance improvements.',
      'Worked closely with cross-functional teams to ship production-ready increments.',
    ],
    technologies: ['C#', '.NET', 'React', 'JavaScript', 'SQL Server', 'Stencil JS', 'AWS'],
  },
  {
    id: 'exp-4',
    title: 'Junior System Analyst',
    company: 'Contata Solutions',
    location: 'Noida, Uttar Pradesh, India',
    startDate: new Date(2019, 10), // November 2019
    endDate: new Date(2021, 9), // October 2021
    description: [
      'Worked as a .NET developer for ESI Synthesis in the Oil and Gas domain.',
      'Implemented business features using C#, SQL Server, JavaScript, and jQuery.',
      'Spearheaded a proof-of-concept initiative in Angular.',
      'Supported development and maintenance of domain-specific enterprise software.',
    ],
    technologies: ['C#', 'SQL Server', 'JavaScript', 'jQuery', 'Angular'],
  },
  {
    id: 'exp-5',
    title: 'Junior Software Engineer',
    company: 'Wildnet Technologies',
    location: 'Noida, Uttar Pradesh, India',
    startDate: new Date(2018, 7), // August 2018
    endDate: new Date(2019, 10), // November 2019
    description: [
      'Worked as a .NET developer with a focus on e-commerce platforms.',
      'Built features using C#, .NET Framework, SQL Server, JavaScript, jQuery, Firebase, and Azure.',
      'Improved application performance and stability for production workloads.',
      'Contributed to release planning and deployment workflows.',
      'Supported AWS cloud infrastructure and service monitoring for reliability.',
      'Delivered full-stack improvements across .NET and React-based solutions.',
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
