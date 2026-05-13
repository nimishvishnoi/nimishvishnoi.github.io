/**
 * One-time seed script — uploads all static portfolio data to Firestore.
 *
 * Usage:
 *   node scripts/seed-firestore.mjs
 *
 * Requires a .env.local with VITE_FIREBASE_* variables.
 * Uses firebase-admin via the REST API so no service account is needed —
 * just your existing client config + a short-lived ID token from the CLI.
 *
 * Simpler approach: uses the firebase JS SDK directly via dynamic import.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim()))
    .filter(([k]) => k)
);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// ── Firebase ─────────────────────────────────────────────────────────────────
const { initializeApp } = await import('firebase/app');
const { getFirestore, doc, setDoc, collection, writeBatch } = await import('firebase/firestore');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Data ─────────────────────────────────────────────────────────────────────

const about = {
  title: 'About',
  description:
    'Dynamic software engineer with a B.Tech in Computer Science and Engineering, building scalable applications across .NET, React, JavaScript, Python, SQL Server, and MongoDB.',
  fullDescription: [
    'I focus on delivering reliable, efficient software that solves real business problems. My day-to-day work includes backend engineering in C#/.NET, modern frontend development with React, and data-centric workflows using SQL Server and Python.',
    'I am also experienced with cloud and delivery tooling, including AWS, GitHub Actions, and Terraform, to support stable releases and automation. I enjoy collaborating with teams, driving technical clarity, and maintaining high engineering standards.',
  ],
};

const summary = {
  name: 'Nimish Vishnoi',
  title: 'Staff Engineer at Nagarro',
  bio: 'Dynamic software engineer with 7+ years of professional experience and a B.Tech in Computer Science and Engineering. Specialized in building scalable applications with C#, .NET Core, JavaScript, React, Python, and SQL Server. Strong expertise with AWS, GitHub Actions, and Terraform for deployment and automation.',
};

const contact = {
  email: 'nimish.vishnoi@rocketmail.com',
  phone: '+91 829-971-8692',
  location: 'Noida, Uttar Pradesh, India',
};

const skillCategories = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Databases',
  tools: 'Tools & Cloud Platforms',
};

const skills = [
  { id: 'skill-1', name: 'C#', category: 'backend', proficiency: 'expert' },
  { id: 'skill-2', name: 'JavaScript', category: 'frontend', proficiency: 'expert' },
  { id: 'skill-3', name: 'Python', category: 'backend', proficiency: 'advanced' },
  { id: 'skill-4', name: 'React', category: 'frontend', proficiency: 'expert' },
  { id: 'skill-5', name: 'Stencil', category: 'frontend', proficiency: 'advanced' },
  { id: 'skill-6', name: 'HTML', category: 'frontend', proficiency: 'expert' },
  { id: 'skill-7', name: 'CSS', category: 'frontend', proficiency: 'expert' },
  { id: 'skill-8', name: 'Git', category: 'tools', proficiency: 'advanced' },
  { id: 'skill-9', name: 'SQL Server', category: 'database', proficiency: 'expert' },
  { id: 'skill-10', name: 'MongoDB', category: 'database', proficiency: 'intermediate' },
  { id: 'skill-11', name: '.NET Core', category: 'backend', proficiency: 'expert' },
  { id: 'skill-12', name: 'ASP.NET MVC', category: 'backend', proficiency: 'expert' },
  { id: 'skill-13', name: 'RESTful Web Services', category: 'backend', proficiency: 'advanced' },
  { id: 'skill-14', name: 'jQuery', category: 'frontend', proficiency: 'advanced' },
  { id: 'skill-15', name: 'Bootstrap', category: 'frontend', proficiency: 'advanced' },
  { id: 'skill-16', name: 'Responsive Web Design', category: 'frontend', proficiency: 'advanced' },
  { id: 'skill-17', name: 'AWS', category: 'tools', proficiency: 'advanced' },
  { id: 'skill-18', name: 'GitHub Actions', category: 'tools', proficiency: 'advanced' },
  { id: 'skill-19', name: 'Terraform', category: 'tools', proficiency: 'advanced' },
  { id: 'skill-20', name: 'Software Testing', category: 'tools', proficiency: 'advanced' },
];

const projects = [
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
    technologies: ['.NET MVC', 'jQuery', 'SQL Server'],
  },
  {
    id: 'proj-3',
    title: 'Bizzalley',
    year: 2019,
    category: 'web',
    description:
      'Customer engagement platform that helps businesses connect with prospects and manage customer inquiries.',
    technologies: ['.NET MVC', 'API', 'Firebase', 'JavaScript', 'SQL Server'],
  },
  {
    id: 'proj-4',
    title: 'ClicFlyer',
    year: 2018,
    category: 'web',
    description:
      'Flyer and promotional-offer management platform developed at Wildnet using .NET MVC.',
    technologies: ['.NET MVC', 'API', 'jQuery', 'SQL Server'],
  },
  {
    id: 'proj-5',
    title: 'Anomaly Detection in Data Center',
    year: 2018,
    category: 'app',
    description:
      'Identified unexpected items or events in datasets using unsupervised learning algorithms.',
    technologies: ['Python', 'Machine Learning'],
  },
  {
    id: 'proj-6',
    title: 'MAC Verification App',
    year: 2017,
    category: 'app',
    description:
      'Android application that verifies a device MAC address against a backend database to prevent unauthorized app distribution.',
    technologies: ['Android', 'PHP', 'MySQL', 'API', 'Bootstrap'],
  },
  {
    id: 'proj-7',
    title: 'College Fest Website',
    year: 2017,
    category: 'web',
    description:
      'Website for the Gyan Jyoti annual college fest, used for event registration and publishing schedules and event details.',
    technologies: ['PHP', 'JavaScript', 'MySQL', 'Bootstrap'],
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

const experiences = [
  {
    id: 'exp-1',
    title: 'Staff Engineer',
    company: 'Nagarro',
    location: 'Noida, Uttar Pradesh, India',
    startDate: new Date(2025, 6).toISOString(),
    endDate: null,
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
    startDate: new Date(2023, 9).toISOString(),
    endDate: new Date(2025, 6).toISOString(),
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
    startDate: new Date(2021, 10, 25).toISOString(),
    endDate: new Date(2023, 9).toISOString(),
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
    startDate: new Date(2020, 0, 9).toISOString(),
    endDate: new Date(2021, 10, 24).toISOString(),
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
    startDate: new Date(2018, 7, 13).toISOString(),
    endDate: new Date(2019, 11, 1).toISOString(),
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

const education = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Technology',
    institution: 'Hindustan College of Science & Technology',
    location: 'Mathura, UP, IN',
    field: 'Computer Science & Engineering',
    startDate: new Date(2014, 6).toISOString(),
    endDate: new Date(2018, 4).toISOString(),
    periodLabel: '2014 - 2018',
  },
  {
    id: 'edu-2',
    degree: 'Intermediate',
    institution: 'Morning Star',
    location: 'India',
    field: 'Physics, Chemistry, Maths',
    startDate: new Date(2012, 3).toISOString(),
    endDate: new Date(2014, 2).toISOString(),
    periodLabel: '2012 - 2014',
  },
  {
    id: 'edu-3',
    degree: 'High School',
    institution: 'Hind Angles Public School',
    location: 'India',
    field: 'High School',
    startDate: new Date(2010, 3).toISOString(),
    endDate: new Date(2012, 2).toISOString(),
    periodLabel: '2010 - 2012',
  },
];

const achievements = [
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

const socialLinks = [
  { id: 'social-1', platform: 'GitHub', url: 'https://github.com/nimishvishnoi', icon: 'FaGithub' },
  {
    id: 'social-2',
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nimishvishnoi',
    icon: 'FaLinkedin',
  },
  {
    id: 'social-3',
    platform: 'Facebook',
    url: 'https://www.facebook.com/nimishvishnoi',
    icon: 'FaFacebook',
  },
  {
    id: 'social-4',
    platform: 'Twitter',
    url: 'https://twitter.com/NimishVishnoi',
    icon: 'FaTwitter',
  },
  {
    id: 'social-5',
    platform: 'Instagram',
    url: 'https://www.instagram.com/nimishvishnoi',
    icon: 'FaInstagram',
  },
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seedCollection(colName, items) {
  const batch = writeBatch(db);
  for (const item of items) {
    batch.set(doc(collection(db, colName), item.id), item);
  }
  await batch.commit();
  console.log(`✓ ${colName} (${items.length} docs)`);
}

async function seed() {
  console.log('Seeding Firestore…\n');

  // Singleton docs under /portfolio
  await setDoc(doc(db, 'portfolio', 'about'), about);
  console.log('✓ portfolio/about');
  await setDoc(doc(db, 'portfolio', 'summary'), summary);
  console.log('✓ portfolio/summary');
  await setDoc(doc(db, 'portfolio', 'contact'), contact);
  console.log('✓ portfolio/contact');
  await setDoc(doc(db, 'portfolio', 'skillCategories'), skillCategories);
  console.log('✓ portfolio/skillCategories');

  // Collections
  await seedCollection('skills', skills);
  await seedCollection('projects', projects);
  await seedCollection('experience', experiences);
  await seedCollection('education', education);
  await seedCollection('achievements', achievements);
  await seedCollection('socialLinks', socialLinks);

  console.log('\nAll done! Your Firestore is seeded.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
