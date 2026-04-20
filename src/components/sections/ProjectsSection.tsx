/**
 * Projects Section Component
 */
import React from 'react';
import { SectionTitle, Card, Badge } from '@components/ui';
import { projects } from '@data/projects';

export const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-[5rem] px-4 bg-gray-50 dark:bg-slate-900">
      <div className="container-custom">
        <SectionTitle title="Projects" subtitle="Showcase of work and expertise" />

        <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {projects.map((project, index) => (
            <Card key={project.id} delay={(index % 2) * 0.2} className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-[Raleway] font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-accent">
                    {project.year}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} text={tech} variant="secondary" size="sm" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
