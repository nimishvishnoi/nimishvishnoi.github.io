import { resumeFileUrl } from '@/constants/site';

const triggerFallbackDownload = (): void => {
  const link = document.createElement('a');
  link.href = resumeFileUrl;
  link.download = 'Nimish_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadResume = async (): Promise<'generated' | 'fallback'> => {
  try {
    const [
      { generateResumePdf },
      { summary, education },
      { experiences },
      { skills },
      { projects },
      { contactInfo },
      { achievements },
    ] = await Promise.all([
      import('@/utils/pdf'),
      import('@data/education'),
      import('@data/experience'),
      import('@data/skills'),
      import('@data/projects'),
      import('@data/contact'),
      import('@data/achievements'),
    ]);

    generateResumePdf(summary, education, experiences, skills, projects, contactInfo, achievements);
    return 'generated';
  } catch (error) {
    console.error('Resume generation failed. Falling back to the predefined PDF.', error);
    triggerFallbackDownload();
    return 'fallback';
  }
};
