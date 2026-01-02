import React, { type ReactNode, isValidElement } from 'react';
import type { Tags, MetaProps, LinkProps } from './types';

/* ----------------------------------------------------------------- */

// Helper to flatten children including Fragments
function flattenChildren(children: ReactNode, result: any[] = []) {
    React.Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;

        if (child.type === React.Fragment) {
            flattenChildren((child.props as any).children, result);
        } else {
            result.push(child);
        }
    });
    return result;
}

export function parseRoofChildren(children: ReactNode): Tags {
    const tags: Tags = {
        title: null,
        meta: [],
        link: [],
        script: [],
    };

    /**
        We use a custom flatten/traverse instead of just forEach to handle nested Fragments
        that might occur from components splitting logic. 
        Actually, React.Children.forEach(children) handles Arrays but NOT Fragments recursion.
        So we use a helper.
    */

    // Note: We can iterate properly now.
    const flatChildren: any[] = [];
    flattenChildren(children, flatChildren);

    flatChildren.forEach((child) => {
        const { type, props } = child;

        if (type === 'title') {
            const titleContent = (props as any).children;
            if (typeof titleContent === 'string') {
                tags.title = titleContent;
            } else if (Array.isArray(titleContent)) {
                tags.title = titleContent.join('');
            }
        } else if (type === 'meta') {
            tags.meta.push(props as MetaProps);
        } else if (type === 'link') {
            tags.link.push(props as LinkProps);
        } else if (type === 'script') {
            tags.script.push(props as any);
        }
    });

    return tags;
}
