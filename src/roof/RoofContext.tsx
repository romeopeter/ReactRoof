import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { RoofContextValue, RoofProviderProps, Tags, MetaProps, LinkProps, ScriptProps } from './types';

const RoofContext = createContext<RoofContextValue | null>(null);

export function RoofProvider({ children }: RoofProviderProps) {
    // Map of componentId -> tags
    const [instances, setInstances] = useState<Map<string, Tags>>(new Map());

    const register = useCallback((id: string, tags: Tags) => {
        setInstances((prev) => {
            const next = new Map(prev);
            next.set(id, tags);
            return next;
        });
    }, []);

    const unregister = useCallback((id: string) => {
        setInstances((prev) => {
            const next = new Map(prev);
            next.delete(id);
            return next;
        });
    }, []);

    // Effect to apply tags to document.head
    useEffect(() => {
        const finalTags = computeFinalTags(instances);
        applyTagsToHead(finalTags);
    }, [instances]);

    return (
        <RoofContext.Provider value={{ instances, register, unregister }}>
            {children}
        </RoofContext.Provider>
    );
}

export function useRoof() {
    const context = useContext(RoofContext);
    if (!context) {
        throw new Error("useRoof must be used within RoofProvider");
    }
    return context;
}

function computeFinalTags(instances: Map<string, Tags>): Tags {
    const finalTags: Tags = {
        title: null,
        meta: [],
        link: [],
        script: [],
    };

    // Iterate in insertion order (standard Map behavior)
    for (const tags of instances.values()) {
        if (tags.title !== null) {
            finalTags.title = tags.title;
        }
        finalTags.meta.push(...tags.meta);
        finalTags.link.push(...tags.link);
        if (tags.script) {
            finalTags.script.push(...tags.script);
        }
    }

    finalTags.meta = deduplicateMeta(finalTags.meta);
    finalTags.link = deduplicateLink(finalTags.link);
    // Scripts are not deduplicated by default (e.g. multiple JSON-LD blocks)

    return finalTags;
}

// Properties that allow multiple values
const ARRAY_PROPERTIES = new Set([
    'og:image', 'og:image:secure_url', 'og:image:type', 'og:image:width', 'og:image:height', 'og:image:alt',
    'og:video', 'og:video:secure_url', 'og:video:type', 'og:video:width', 'og:video:height', 'og:video:duration', 'og:video:release_date',
    'og:audio', 'og:audio:secure_url', 'og:audio:type',
    'article:tag', 'article:author'
]);

function deduplicateMeta(metaTags: MetaProps[]): MetaProps[] {
    const seen = new Map<string, MetaProps>();
    const arrayTags: MetaProps[] = [];

    // Process in reverse to let the last one win
    for (let i = metaTags.length - 1; i >= 0; i--) {
        const meta = metaTags[i];

        // Key by name, property, or charset
        const uniqueKey = meta.name || meta.property || meta.charSet || (meta as any).httpEquiv;

        if (uniqueKey) {
            if (meta.property && ARRAY_PROPERTIES.has(meta.property)) {
                // For array properties, we don't dedup by key alone.
                // We simply collect them. 
                // Issue: Fallback/Override behavior.
                // If we simply collect all, we append.
                // If we want "Override", we need identifying grouping?
                // For now, let's allow all (Append behavior). 
                // Note: We are iterating in reverse.
                arrayTags.push(meta);
            } else {
                if (!seen.has(uniqueKey)) {
                    seen.set(uniqueKey, meta);
                }
            }
        }
    }

    // arrayTags are collected in reverse (last rendered first). 
    // Standard DOM order usually matters (first one parsed).
    // If we want Child (Last) to come First in DOM? 
    // RoofContext appends to Head.

    return [...Array.from(seen.values()).reverse(), ...arrayTags.reverse()];
}

function deduplicateLink(linkTags: LinkProps[]): LinkProps[] {
    const seen = new Map<string, LinkProps>();

    for (let i = linkTags.length - 1; i >= 0; i--) {
        const link = linkTags[i];

        let key = `${link.rel}-${link.href}`;
        if (link.rel === 'canonical') {
            key = 'canonical';
        }

        if (!seen.has(key)) {
            seen.set(key, link);
        }
    }

    return Array.from(seen.values()).reverse();
}

function applyTagsToHead(tags: Tags) {
    if (tags.title !== null) {
        document.title = tags.title;
    }

    updateMetaTags(tags.meta);
    updateLinkTags(tags.link);
    updateScriptTags(tags.script);
}

function updateMetaTags(metaTags: MetaProps[]) {
    const existing = document.querySelectorAll('meta[data-roof="true"]');
    existing.forEach(el => el.remove());

    metaTags.forEach(props => {
        const meta = document.createElement('meta');
        Object.entries(props).forEach(([key, value]) => {
            if (value !== undefined) {
                meta.setAttribute(key, String(value));
            }
        });
        meta.setAttribute('data-roof', 'true');
        document.head.appendChild(meta);
    });
}

function updateLinkTags(linkTags: LinkProps[]) {
    const existing = document.querySelectorAll('link[data-roof="true"]');
    existing.forEach(el => el.remove());

    linkTags.forEach(props => {
        const link = document.createElement('link');
        Object.entries(props).forEach(([key, value]) => {
            if (value !== undefined) {
                link.setAttribute(key, String(value));
            }
        });
        link.setAttribute('data-roof', 'true');
        document.head.appendChild(link);
    });
}

function updateScriptTags(scriptTags: ScriptProps[]) {
    const existing = document.querySelectorAll('script[data-roof="true"]');
    existing.forEach(el => el.remove());

    scriptTags.forEach(props => {
        const script = document.createElement('script');

        Object.entries(props).forEach(([key, value]) => {
            if (key === 'dangerouslySetInnerHTML') {
                // React specific prop handling
                const html = (value as { __html: string }).__html;
                script.innerHTML = html;
            } else if (key === 'children') {
                // handle plain text children if passed?
                if (typeof value === 'string') script.innerHTML = value;
            } else if (value !== undefined) {
                script.setAttribute(key, String(value));
            }
        });

        script.setAttribute('data-roof', 'true');
        document.head.appendChild(script);
    });
}
