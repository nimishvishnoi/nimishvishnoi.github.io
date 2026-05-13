/**
 * About Section Component
 */
import React from 'react';
import { SectionTitle, Card } from '@components/ui';
import { useContent } from '@hooks/useContent';

export const AboutSection: React.FC = () => {
  const { content } = useContent();
  const { about } = content;

  return (
    <section id="about" className="py-[5rem] px-4 scroll-mt-24 lg:scroll-mt-20">
      <div className="container-custom">
        <SectionTitle title={about.title} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
          {about.fullDescription.map((paragraph, index) => (
            <Card key={index} delay={index * 0.2}>
              <p className="break-words text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                {paragraph}
              </p>
            </Card>
          ))}
        </div>

        <Card>
          <p className="break-words text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {about.description}
          </p>
        </Card>
      </div>
    </section>
  );
};
