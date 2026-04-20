/**
 * Experience Section Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { SectionTitle, Card, Badge } from '@components/ui';
import { experiences } from '@data/experience';
import { education, summary } from '@data/education';
import { getTotalExperience, formatExperience, formatDate } from '@/utils';

export const ResumeSection: React.FC = () => {
  const totalExp = getTotalExperience(experiences);

  return (
    <section id="resume" className="py-section px-4 lg:ml-80">
      <div className="container-custom">
        <SectionTitle title="Resume" subtitle="Professional journey and expertise" />

        {/* Summary */}
        <Card className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-heading font-bold mb-2">{summary.name}</h3>
              <p className="text-primary-600 dark:text-primary-400 font-accent mb-4">
                {summary.title}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary.bio}</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Experience</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatExperience(totalExp.years, totalExp.months)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                <p className="font-semibold text-gray-800 dark:text-white">Noida, India</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                <a
                  href="mailto:nimish.vishnoi@rocketmail.com"
                  className="font-semibold hover:text-primary-600 smooth-transition"
                >
                  nimish.vishnoi@rocketmail.com
                </a>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6 text-primary-600 dark:text-primary-400">
              Education
            </h3>
            {education.map((edu, index) => (
              <Card key={edu.id} delay={index * 0.2} className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                <p className="text-primary-600 dark:text-primary-400 font-accent mb-2">
                  {edu.field}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {edu.institution} • {edu.location}
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </Card>
            ))}
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6 text-primary-600 dark:text-primary-400">
              Professional Experience
            </h3>
            {experiences.map((exp, index) => (
              <Card key={exp.id} delay={index * 0.2} className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{exp.title}</h4>
                <p className="text-primary-600 dark:text-primary-400 font-accent mb-2">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </p>

                <ul className="space-y-2 mb-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                      <span className="text-primary-600 dark:text-primary-400">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} text={tech} variant="secondary" size="sm" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Download Resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="./Nimish_Resume.pdf"
            download
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-accent font-bold rounded-lg hover:shadow-lg smooth-transition"
          >
            ⬇ Download Full Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
};
