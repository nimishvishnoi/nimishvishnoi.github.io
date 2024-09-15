import React from 'react';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const projectList = [
    { title: 'Project 1', description: 'Description of project 1', link: 'https://github.com/nimishvishnoi/project1' },
    { title: 'Project 2', description: 'Description of project 2', link: 'https://github.com/nimishvishnoi/project2' },
  ];

  return (
    <section className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectList.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
