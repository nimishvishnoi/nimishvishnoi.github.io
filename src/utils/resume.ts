import { resumeFileUrl } from '@/constants/site';
import { resumePayload } from '@data/resume';

export const downloadPredefinedResume = (): void => {
  const link = document.createElement('a');
  link.href = resumeFileUrl;
  link.download = 'Nimish_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadGeneratedResume = async (): Promise<'generated' | 'fallback'> => {
  try {
    const { generateResumePdf } = await import('@/utils/pdf');

    generateResumePdf(
      resumePayload.summary,
      resumePayload.education,
      resumePayload.experiences,
      resumePayload.skills,
      resumePayload.projects,
      resumePayload.contactInfo,
      resumePayload.achievements
    );
    return 'generated';
  } catch (error) {
    console.error('Resume generation failed. Falling back to the predefined PDF.', error);
    downloadPredefinedResume();
    return 'fallback';
  }
};
