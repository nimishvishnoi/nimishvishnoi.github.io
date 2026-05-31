import { describe, it, expect, beforeEach } from 'vitest';
import { updateSEOMetadata, seoDefaults, seoSections } from '../utils/seo';

describe('SEO Utilities', () => {
  beforeEach(() => {
    // Clean up document head
    document.head.innerHTML = '<title>Initial Title</title>';
  });

  it('should have default SEO metadata', () => {
    expect(seoDefaults.title).toContain('Nimish Vishnoi');
    expect(seoDefaults.keywords.length).toBeGreaterThan(0);
  });

  it('should have SEO sections configured', () => {
    expect(seoSections.home).toBeDefined();
    expect(seoSections.about).toBeDefined();
    expect(seoSections.projects).toBeDefined();
  });

  it('should update document title', () => {
    const metadata = { ...seoDefaults, title: 'Test Page' };
    updateSEOMetadata(metadata);
    expect(document.title).toBe('Test Page');
  });

  it('should create meta description tag', () => {
    const metadata = { ...seoDefaults, description: 'Test description' };
    updateSEOMetadata(metadata);
    const descTag = document.querySelector('meta[name="description"]');
    expect(descTag?.getAttribute('content')).toBe('Test description');
  });

  it('should create Open Graph tags', () => {
    const metadata = {
      ...seoDefaults,
      ogImage: 'https://example.com/image.jpg',
      ogUrl: 'https://example.com',
    };
    updateSEOMetadata(metadata);
    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage?.getAttribute('content')).toBe('https://example.com/image.jpg');
  });

  it('should create canonical URL', () => {
    const metadata = { ...seoDefaults, canonicalUrl: 'https://example.com/page' };
    updateSEOMetadata(metadata);
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://example.com/page');
  });

  it('should create structured data', () => {
    const metadata = { ...seoDefaults, publishedDate: '2024-01-01' };
    updateSEOMetadata(metadata);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const data = JSON.parse(script?.textContent || '{}');
    expect(data['@context']).toBe('https://schema.org');
  });
});
