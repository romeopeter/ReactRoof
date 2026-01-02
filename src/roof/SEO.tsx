 import type { SEOProps, ImageSEO, ImageSEOObject } from './types';
import { Head } from './Head';

export function SEO({
    title,
    description,
    image,
    images,
    url,
    type = 'website',
    siteName,
    locale,
    robots,
    twitter,
    article,
    video,
    links,
    jsonLd,
}: SEOProps) {

    // --- Helpers ---
    const normalizeImage = (img: ImageSEO): ImageSEOObject => {
        if (typeof img === 'string') return { url: img };
        return img;
    };

    const getImages = (): ImageSEOObject[] => {
        if (images && images.length > 0) return images.map(normalizeImage);
        if (image) return [normalizeImage(image)];
        return [];
    };

    const allImages = getImages();

    // JSON-LD Helper
    const renderJsonLd = (data: any) => {
        const safeJson = JSON.stringify(data)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e');
        return { __html: safeJson };
    };

    return (
        <Head>
            {/* --- Basic HTML Meta Tags --- */}
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {robots && <meta name="robots" content={robots} />}

            {/* --- Open Graph Tags --- */}
            <meta property="og:type" content={type} />
            {title && <meta property="og:title" content={title} />}
            {description && <meta property="og:description" content={description} />}
            {url && <meta property="og:url" content={url} />}
            {siteName && <meta property="og:site_name" content={siteName} />}
            {locale && <meta property="og:locale" content={locale} />}

            {/* OG Images */}
            {allImages.map((img, index) => (
                <React.Fragment key={`og-image-${index}`}>
                    <meta property="og:image" content={img.url} />
                    {img.secureUrl && <meta property="og:image:secure_url" content={img.secureUrl} />}
                    {img.type && <meta property="og:image:type" content={img.type} />}
                    {img.width && <meta property="og:image:width" content={String(img.width)} />}
                    {img.height && <meta property="og:image:height" content={String(img.height)} />}
                    {img.alt && <meta property="og:image:alt" content={img.alt} />}
                </React.Fragment>
            ))}

            {/* --- Twitter Card Tags --- */}
            {(twitter || title || description || image) && (
                <>
                    <meta name="twitter:card" content={twitter?.card || 'summary'} />
                    {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
                    {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}

                    {/* Fallbacks to main props if twitter specific not provided */}
                    <meta name="twitter:title" content={twitter?.title || title} />
                    <meta name="twitter:description" content={twitter?.description || description} />

                    {/* Image fallback: Use twitter specific, or first main image */}
                    {(() => {
                        const twImg = twitter?.image ? normalizeImage(twitter.image) : allImages[0];
                        return twImg ? <meta name="twitter:image" content={twImg.url} /> : null;
                    })()}
                </>
            )}

            {/* --- Type Specific Metadata --- */}
            {/* Article */}
            {type === 'article' && article && (
                <>
                    {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
                    {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
                    {article.section && <meta property="article:section" content={article.section} />}

                    {/* Author */}
                    {article.author && (Array.isArray(article.author) ? article.author : [article.author]).map((auth, i) => (
                        <meta key={`article-auth-${i}`} property="article:author" content={auth} />
                    ))}

                    {/* Tags */}
                    {article.tags && article.tags.map((tag, i) => (
                        <meta key={`article-tag-${i}`} property="article:tag" content={tag} />
                    ))}
                </>
            )}

            {/* Video */}
            {type === 'video' && video && (
                <>
                    <meta property="og:video" content={video.url} />
                    {video.secureUrl && <meta property="og:video:secure_url" content={video.secureUrl} />}
                    {video.type && <meta property="og:video:type" content={video.type} />}
                    {video.width && <meta property="og:video:width" content={String(video.width)} />}
                    {video.height && <meta property="og:video:height" content={String(video.height)} />}
                    {video.duration && <meta property="og:video:duration" content={String(video.duration)} />}
                    {video.releaseDate && <meta property="og:video:release_date" content={video.releaseDate} />}
                </>
            )}

            {/* --- Links --- */}
            {links && links.map((linkProps, index) => (
                <link key={`seo-link-${index}`} {...linkProps} />
            ))}

            {/* --- JSON-LD --- */}
            {jsonLd && (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((data, index) => (
                <script
                    key={`json-ld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={renderJsonLd(data)}
                />
            ))}

        </Head>
    );
}

import React from 'react';
