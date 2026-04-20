/**
 * About Section Component
 */
import React from 'react';
import { SectionTitle, Card } from '@components/ui';
import { aboutContent } from '@data/about';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-section px-4">
      <div className="container-custom">
        <SectionTitle title={aboutContent.title} />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {aboutContent.fullDescription.map((paragraph, index) => (
            <Card key={index} delay={index * 0.2}>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {paragraph}
              </p>
            </Card>
          ))}
        </div>

        <Card>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {aboutContent.description}
          </p>
        </Card>
      </div>
    </section>
  );
};
