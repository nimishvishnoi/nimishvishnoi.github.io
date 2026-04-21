import { jsPDF } from 'jspdf';
import type { Education, Experience, Skill, Project, ContactInfo, Achievement } from '@types';

interface ResumeSummary {
  name: string;
  title: string;
  bio: string;
}

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 40;
const LINE_HEIGHT = 16;

const addSectionHeading = (doc: jsPDF, title: string, y: number): number => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, MARGIN, y);
  return y + LINE_HEIGHT * 1.8;
};

const addParagraph = (doc: jsPDF, text: string, y: number): number => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, PAGE_WIDTH - MARGIN * 2);
  doc.text(lines, MARGIN, y);
  return y + lines.length * LINE_HEIGHT + 10;
};

const addPageBreakIfNeeded = (doc: jsPDF, y: number): number => {
  if (y >= PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
};

export const generateResumePdf = (
  summary: ResumeSummary,
  education: Education[],
  experiences: Experience[],
  skills: Skill[],
  projects: Project[],
  contactInfo: ContactInfo,
  achievements: Achievement[]
): void => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = MARGIN;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(summary.name, MARGIN, y);
  y += LINE_HEIGHT * 1.8;

  doc.setFontSize(12);
  doc.setTextColor('#0c4a6e');
  doc.text(summary.title, MARGIN, y);
  y += LINE_HEIGHT * 2;

  doc.setTextColor('#000000');
  y = addParagraph(doc, summary.bio, y);
  y += 10;

  y = addSectionHeading(doc, 'Education', y);
  education.forEach((item) => {
    y = addPageBreakIfNeeded(doc, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(item.degree, MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`${item.institution} • ${item.location}`, MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(
      `${item.field} • ${item.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${item.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
      MARGIN,
      y
    );
    y += LINE_HEIGHT * 1.6;
  });

  y = addSectionHeading(doc, 'Achievements & Certifications', y);
  achievements.forEach((achievement) => {
    y = addPageBreakIfNeeded(doc, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(achievement.title, MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`${achievement.organization} • ${achievement.year}`, MARGIN, y);
    y += LINE_HEIGHT;
    y = addParagraph(doc, achievement.description, y);
  });

  y = addSectionHeading(doc, 'Professional Experience', y);
  experiences.forEach((item) => {
    y = addPageBreakIfNeeded(doc, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(item.title, MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`${item.company} • ${item.location}`, MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(
      `${item.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${item.endDate ? item.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}`,
      MARGIN,
      y
    );
    y += LINE_HEIGHT;

    item.description.forEach((bullet) => {
      if (y >= PAGE_HEIGHT - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }
      const lines = doc.splitTextToSize(`• ${bullet}`, PAGE_WIDTH - MARGIN * 2);
      doc.text(lines, MARGIN, y);
      y += lines.length * LINE_HEIGHT;
    });

    const techText = item.technologies.join(', ');
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`Technologies: ${techText}`, MARGIN, y);
    y += LINE_HEIGHT * 1.6;
  });

  y = addSectionHeading(doc, 'Skills', y);
  const skillCategories = {
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    database: 'Database',
    tools: 'Tools & Technologies',
  };
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  Object.entries(groupedSkills).forEach(([category, categorySkills]) => {
    y = addPageBreakIfNeeded(doc, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(skillCategories[category as keyof typeof skillCategories], MARGIN, y);
    y += LINE_HEIGHT;
    const skillNames = categorySkills.map((s: Skill) => s.name).join(', ');
    y = addParagraph(doc, skillNames, y);
  });

  y = addSectionHeading(doc, 'Projects', y);
  projects.forEach((project) => {
    y = addPageBreakIfNeeded(doc, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(project.title, MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`${project.year} • ${project.category}`, MARGIN, y);
    y += LINE_HEIGHT;
    y = addParagraph(doc, project.description, y);
    const techText = project.technologies.join(', ');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`Technologies: ${techText}`, MARGIN, y);
    y += LINE_HEIGHT * 1.6;
  });

  y = addSectionHeading(doc, 'Contact Information', y);
  y = addPageBreakIfNeeded(doc, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Email: ${contactInfo.email}`, MARGIN, y);
  y += LINE_HEIGHT;
  doc.text(`Phone: ${contactInfo.phone}`, MARGIN, y);
  y += LINE_HEIGHT;
  doc.text(`Location: ${contactInfo.location}`, MARGIN, y);
  y += LINE_HEIGHT * 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Portfolio Website: https://nimishvishnoi.github.io', MARGIN, y);

  doc.save('Nimish_Vishnoi_Resume.pdf');
};
