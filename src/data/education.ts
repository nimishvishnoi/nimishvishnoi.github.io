/**
 * Education data
 */
import type { Education } from '@types';

export const education: Education[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Technology',
    institution: 'Hindustan College of Science & Technology',
    location: 'Mathura, UP, IN',
    field: 'Computer Science & Engineering',
    startDate: new Date(2014, 6), // July 2014
    endDate: new Date(2018, 4), // May 2018
    periodLabel: '2014 - 2018',
  },
  {
    id: 'edu-2',
    degree: 'Intermediate',
    institution: 'Morning Star',
    location: 'India',
    field: 'Physics, Chemistry, Maths',
    startDate: new Date(2012, 3), // April 2012
    endDate: new Date(2014, 2), // March 2014
    periodLabel: '2012 - 2014',
  },
  {
    id: 'edu-3',
    degree: 'High School',
    institution: 'Hind Angles Public School',
    location: 'India',
    field: 'High School',
    startDate: new Date(2010, 3), // April 2010
    endDate: new Date(2012, 2), // March 2012
    periodLabel: '2010 - 2012',
  },
];

export const summary = {
  name: 'Nimish Vishnoi',
  title: 'Staff Engineer at Nagarro',
  bio: 'Dynamic software engineer with a B.Tech in Computer Science and Engineering, experienced in building scalable applications with C#, .NET Core, JavaScript, React, Python, and SQL Server. Strong with AWS, GitHub Actions, and Terraform for deployment and automation.',
};
