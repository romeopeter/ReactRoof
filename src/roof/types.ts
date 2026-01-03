import type { ReactNode, MetaHTMLAttributes, LinkHTMLAttributes } from 'react';

export type MetaProps = MetaHTMLAttributes<HTMLMetaElement>;
export type LinkProps = LinkHTMLAttributes<HTMLLinkElement>;

export type ScriptProps = React.ScriptHTMLAttributes<HTMLScriptElement>;

export interface Tags {
    title: string | null;
    meta: MetaProps[];
    link: LinkProps[];
    script: ScriptProps[];
}

export interface RoofContextValue {
    instances: Map<string, Tags>;
    register: (id: string, tags: Tags) => void;
    unregister: (id: string) => void;
}

export interface RoofProviderProps {
    children: ReactNode;
}

export interface HeadProps {
    children: ReactNode;
}

// SEO Component Types

export interface ImageSEOObject {
    url: string;
    secureUrl?: string;
    width?: number;
    height?: number;
    alt?: string;
    type?: string;
}

export type ImageSEO = string | ImageSEOObject;

export interface TwitterSEO {
    card?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: ImageSEO;
}

export interface ArticleSEO {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string | string[];
    section?: string;
    tags?: string[];
}

export interface VideoSEO {
    url: string;
    secureUrl?: string;
    type?: string;
    width?: number;
    height?: number;
    duration?: number;
    releaseDate?: string;
    // Actors, directors, etc. could be added but guide implies strict list
}

export interface SEOProps {
    // Core (Default/Required logic handled in component)
    title?: string;
    description?: string;
    image?: ImageSEO;
    images?: ImageSEO[];

    // Optional Overrides
    url?: string;
    type?: "website" | "article" | "video" | "product" | "profile" | "book" | "music.song" | "music.album" | string;
    siteName?: string;
    locale?: string;
    robots?: string; // e.g. "index, follow"

    // Platform Specific
    twitter?: TwitterSEO;

    // Type Specific
    article?: ArticleSEO;
    video?: VideoSEO;

    // Links
    links?: LinkProps[];

    // JSON-LD
    jsonLd?: Record<string, any> | Record<string, any>[];
}
