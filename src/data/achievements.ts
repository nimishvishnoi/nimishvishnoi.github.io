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
    title: 'Runner Up in Smart India Hackathon 2017',
    organization: 'Smart India Hackathon (SIH) organized by GOI',
    year: '2017',
    description: 'Runner-up in SIH organized by the GOI, receiving recognition from the ISRO Chairman.',
  },
  {
    id: 'fest-coordinator-2017',
    title: 'College Fest Tech & Web Dev Coordinator 2017',
    organization: 'Gyan Jyoti Fest',
    year: '2017',
    description: 'Coordinated tech and web dev for Gyan Jyoti fest, developed fest website enabling event registration and info dissemination.',
  },
];