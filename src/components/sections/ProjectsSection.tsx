/**
 * Projects Section Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { SectionTitle, Card, Badge } from '@components/ui';
import { projects } from '@data/projects';

export const ProjectsSection: React.FC = () => {
  return (
    <section id="portfolio" className="py-section px-4 lg:ml-80 bg-gray-50 dark:bg-dark-bg">
      <div className="container-custom">
        <SectionTitle title="Projects" subtitle="Showcase of work and expertise" />

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={project.id} delay={(index % 2) * 0.2} className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-accent">
                    {project.year}
                  </p>
                </div>
                <Badge
                  text={project.category}
                  variant={
                    project.category === 'app'
                      ? 'primary'
                      : project.category === 'web'
                        ? 'secondary'
                        : 'outline'
                  }
                  size="sm"
                />
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} text={tech} variant="secondary" size="sm" />
                ))}
              </div>

              {project.url && (
                <motion.a
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-accent font-semibold smooth-transition"
                >
                  Visit Project →
                </motion.a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
