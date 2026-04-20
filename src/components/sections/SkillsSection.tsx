/**
 * Skills Section Component
 */
import React from 'react';
import { SectionTitle, Card, Badge } from '@components/ui';
import { skills, skillCategories } from '@data/skills';

export const SkillsSection: React.FC = () => {
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>,
  );

  return (
    <section id="skills" className="py-section px-4 lg:ml-80 bg-gray-50 dark:bg-dark-bg">
      <div className="container-custom">
        <SectionTitle title="Skills" subtitle="Expertise across modern technologies" />

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <Card key={category} delay={categoryIndex * 0.2}>
              <h3 className="text-xl font-heading font-bold text-primary-600 dark:text-primary-400 mb-4">
                {skillCategories[category as keyof typeof skillCategories]}
              </h3>

              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    text={skill.name}
                    variant={
                      skill.proficiency === 'expert'
                        ? 'primary'
                        : skill.proficiency === 'advanced'
                          ? 'secondary'
                          : 'outline'
                    }
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
