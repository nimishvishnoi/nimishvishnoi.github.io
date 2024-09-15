import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h3 className="text-2xl font-bold">{project.title}</h3>
      <p className="mt-2">{project.description}</p>
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-4 inline-block">View Project</a>
    </div>
  );
};

export default ProjectCard;
