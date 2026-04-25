/**
 * Skills Section Component
 */
import React from 'react';
import { SectionTitle, Card, Badge } from '@components/ui';
import type { Skill } from '@types';
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
    {} as Record<string, Skill[]>
  );

  return (
    <section
      id="skills"
      className="py-[5rem] px-4 bg-gray-50 dark:bg-slate-900 scroll-mt-24 lg:scroll-mt-20"
    >
      <div className="container-custom">
        <SectionTitle title="Skills" subtitle="Expertise across modern technologies" />

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <Card key={category} delay={categoryIndex * 0.2}>
              <h3 className="text-xl font-[Raleway] font-bold text-primary-600 dark:text-primary-400 mb-4">
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
