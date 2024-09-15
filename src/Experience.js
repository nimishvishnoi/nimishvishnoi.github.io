import React from 'react';

const Experience = () => {
  const experiences = [
    { company: 'Company 1', role: 'Software Engineer', duration: 'Jan 2020 - Present' },
    { company: 'Company 2', role: 'Intern', duration: 'Jun 2019 - Dec 2019' },
  ];

  return (
    <section className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Experience</h2>
      <ul>
        {experiences.map((exp, index) => (
          <li key={index} className="mb-4">
            <h3 className="text-2xl font-semibold">{exp.role}</h3>
            <p>{exp.company} - {exp.duration}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Experience;
