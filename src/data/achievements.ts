export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: 'sih-2017',
    title: 'Runner-up in Smart India Hackathon 2017',
    organization: 'Smart India Hackathon organized by the Government of India',
    year: '2017',
    description:
      'Earned runner-up recognition in SIH 2017, including recognition from the ISRO Chairman.',
  },
  {
    id: 'fest-coordinator-2017',
    title: 'College Fest Technical and Web Coordinator',
    organization: 'Gyan Jyoti Fest',
    year: '2017',
    description:
      'Coordinated technical execution and built the fest website for event registration, schedules, and public information.',
  },
];
