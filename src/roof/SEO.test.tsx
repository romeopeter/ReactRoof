import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { RoofProvider } from './RoofContext';
import { SEO } from './SEO';

// @vitest-environment jsdom

describe('SEO Component', () => {
    afterEach(() => {
        cleanup();
        document.head.innerHTML = '';
        document.title = '';
    });

    it('should calculate title and description', () => {
        render(
            <RoofProvider>
                <SEO
                    title="Test Page"
                    description="Test Desc"
                    robots="noindex"
                />
            </RoofProvider>
        );

        expect(document.title).toBe('Test Page');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Test Desc');
        expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');

        // Open Graph defaults
        expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Test Page');
        expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('Test Desc');
    });

    it('should handle images (string vs object)', () => {
        render(
            <RoofProvider>
                <SEO
                    image="https://example.com/img.jpg"
                />
            </RoofProvider>
        );
        expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://example.com/img.jpg');

        cleanup();
        document.head.innerHTML = '';

        render(
            <RoofProvider>
                <SEO
                    image={{ url: 'https://example.com/complex.jpg', width: 800, height: 600, alt: 'Complex' }}
                />
            </RoofProvider>
        );
        expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://example.com/complex.jpg');
        expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('800');
        expect(document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toBe('Complex');
    });

    it('should render multiple images', () => {
        render(
            <RoofProvider>
                <SEO
                    images={[
                        "https://example.com/1.jpg",
                        { url: "https://example.com/2.jpg", width: 100 }
                    ]}
                />
            </RoofProvider>
        );

        const ogImages = document.querySelectorAll('meta[property="og:image"]');
        expect(ogImages.length).toBe(2);
        expect(ogImages[0].getAttribute('content')).toBe('https://example.com/1.jpg');
        expect(ogImages[1].getAttribute('content')).toBe('https://example.com/2.jpg');

        expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('100');
    });

    it('should render article tags', () => {
        render(
            <RoofProvider>
                <SEO
                    type="article"
                    article={{
                        publishedTime: "2024-01-01",
                        tags: ["React", "SEO"]
                    }}
                />
            </RoofProvider>
        );

        expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');
        expect(document.querySelector('meta[property="article:published_time"]')?.getAttribute('content')).toBe('2024-01-01');

        const articleTags = document.querySelectorAll('meta[property="article:tag"]');
        expect(articleTags.length).toBe(2);
    });

    it('should render JSON-LD scripts', () => {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "My Org"
        };

        render(
            <RoofProvider>
                <SEO jsonLd={jsonLd} />
            </RoofProvider>
        );

        const script = document.querySelector('script[type="application/ld+json"]');
        expect(script).not.toBeNull();
        expect(script?.innerHTML).toContain('"Organization"');
        expect(script?.innerHTML).toContain('"My Org"');
    });

    it('should handle nested JSON-LD (multiple scripts)', () => {
        const jsonLd = [
            { "@type": "A" },
            { "@type": "B" }
        ];

        render(
            <RoofProvider>
                <SEO jsonLd={jsonLd} />
            </RoofProvider>
        );

        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        expect(scripts.length).toBe(2);
    });
});
