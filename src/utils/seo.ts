export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

export const seoDefaults: SEOMetadata = {
  title: 'Nimish Vishnoi | Full Stack Developer',
  description:
    'Full-stack developer specializing in React, TypeScript, Firebase, and cloud technologies. Explore my portfolio and projects.',
  keywords: [
    'full stack developer',
    'react',
    'typescript',
    'firebase',
    'web development',
    'portfolio',
  ],
  author: 'Nimish Vishnoi',
};

export const seoSections: Record<string, SEOMetadata> = {
  home: {
    title: 'Nimish Vishnoi | Full Stack Developer Portfolio',
    description:
      'Welcome to my portfolio. Full-stack developer with expertise in modern web technologies.',
    keywords: [
      'portfolio',
      'developer',
      'full stack',
      'react',
      'typescript',
    ],
  },
  about: {
    title: 'About Nimish Vishnoi | Developer Profile',
    description:
      'Learn about my professional background, expertise, and passion for web development.',
    keywords: ['about', 'profile', 'developer', 'experience'],
  },
  skills: {
    title: 'Skills & Technologies | Nimish Vishnoi',
    description:
      'Comprehensive list of technical skills including React, TypeScript, Firebase, Node.js, and more.',
    keywords: [
      'skills',
      'technologies',
      'react',
      'node.js',
      'firebase',
      'typescript',
    ],
  },
  resume: {
    title: 'Professional Resume | Nimish Vishnoi',
    description:
      'Download my professional resume showcasing education, experience, and achievements.',
    keywords: ['resume', 'cv', 'experience', 'education'],
  },
  projects: {
    title: 'Portfolio Projects | Nimish Vishnoi',
    description: 'Explore my recent projects and case studies demonstrating my development expertise.',
    keywords: ['projects', 'portfolio', 'case studies', 'web applications'],
  },
  contact: {
    title: 'Contact | Nimish Vishnoi',
    description: 'Get in touch with me for collaborations, opportunities, or inquiries.',
    keywords: ['contact', 'reach out', 'collaboration', 'inquiry'],
  },
};

/**
 * Update document head with SEO metadata
 */
export function updateSEOMetadata(metadata: SEOMetadata) {
  // Update title
  document.title = metadata.title;

  // Update or create meta tags
  updateMetaTag('description', metadata.description);
  updateMetaTag('keywords', metadata.keywords.join(', '));
  
  if (metadata.author) {
    updateMetaTag('author', metadata.author);
  }
  
  // Open Graph tags
  if (metadata.ogImage) {
    updateMetaTag('og:image', metadata.ogImage, 'property');
  }
  if (metadata.ogUrl) {
    updateMetaTag('og:url', metadata.ogUrl, 'property');
  }
  updateMetaTag('og:title', metadata.title, 'property');
  updateMetaTag('og:description', metadata.description, 'property');
  
  // Twitter Card tags
  if (metadata.twitterCard) {
    updateMetaTag('twitter:card', metadata.twitterCard);
  }
  updateMetaTag('twitter:title', metadata.title);
  updateMetaTag('twitter:description', metadata.description);
  
  // Canonical URL
  if (metadata.canonicalUrl) {
    updateCanonicalURL(metadata.canonicalUrl);
  }

  // Structured data for schema.org
  if (metadata.publishedDate || metadata.modifiedDate) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Nimish Vishnoi',
      title: 'Full Stack Developer',
      url: window.location.origin,
      ...(metadata.publishedDate && { datePublished: metadata.publishedDate }),
      ...(metadata.modifiedDate && { dateModified: metadata.modifiedDate }),
    };
    updateStructuredData(structuredData);
  }
}

/**
 * Helper to update or create meta tag
 */
function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Update canonical URL
 */
function updateCanonicalURL(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

/**
 * Update or create structured data script tag
 */
function updateStructuredData(data: any) {
  let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
