import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { RoofContextValue, RoofProviderProps, Tags, MetaProps, LinkProps } from './types';

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
    };

    // Iterate in insertion order (standard Map behavior)
    for (const tags of instances.values()) {
        if (tags.title !== null) {
            finalTags.title = tags.title;
        }
        finalTags.meta.push(...tags.meta);
        finalTags.link.push(...tags.link);
    }

    finalTags.meta = deduplicateMeta(finalTags.meta);
    finalTags.link = deduplicateLink(finalTags.link);

    return finalTags;
}

function deduplicateMeta(metaTags: MetaProps[]): MetaProps[] {
    const seen = new Map<string, MetaProps>();

    // Process in reverse to let the last one win
    for (let i = metaTags.length - 1; i >= 0; i--) {
        const meta = metaTags[i];

        // Key by name, property, or charset
        // We treat httpEquiv specially? Or just as another key.
        const key = meta.name || meta.property || meta.charSet || (meta as any).httpEquiv;

        if (key && !seen.has(key)) {
            seen.set(key, meta);
        } else if (!key) {
            // If no key, we can't dedup easily. 
            // Some meta tags might just be pure content? Unlikely for valid HTML.
            // We accumulate them if we can't identify them.
            // But for this simple implementation, let's just keep them if they are unique objects? 
            // No, let's just append them to a list of "unkeyed" metas if we wanted, 
            // but for now let's skip strict complex dedup for unkeyed items.
        }
    }

    return Array.from(seen.values()).reverse();
}

function deduplicateLink(linkTags: LinkProps[]): LinkProps[] {
    const seen = new Map<string, LinkProps>();

    for (let i = linkTags.length - 1; i >= 0; i--) {
        const link = linkTags[i];
        // Key by rel + href. Actually typically just rel is enough for some (like canonical).
        // But for stylesheets, you might have multiple. 
        // Standard helmet practice: rel + href is a unique identifier? 
        // Or just "rel" if it's something like "canonical".

        // Let's use a composite key plan for now:
        // If rel is canonical, key is 'canonical' (only one allowed).
        // Otherwise, key is rel + href.

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
}

function updateMetaTags(metaTags: MetaProps[]) {
    // 1. Remove existing managed tags
    const existing = document.querySelectorAll('meta[data-roof="true"]');
    existing.forEach(el => el.remove());

    // 2. Add new tags
    metaTags.forEach(props => {
        const meta = document.createElement('meta');
        Object.entries(props).forEach(([key, value]) => {
            // value can be string | number | undefined
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
