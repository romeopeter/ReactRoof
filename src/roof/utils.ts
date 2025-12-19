import React, { type ReactNode, isValidElement } from 'react';
import type { Tags, MetaProps, LinkProps } from './types';

export function parseRoofChildren(children: ReactNode): Tags {
    const tags: Tags = {
        title: null,
        meta: [],
        link: [],
    };

    React.Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;

        const { type, props } = child;

        // We check the type. parsing children relies on specific element names.
        // In React, 'title', 'meta', 'link' are standard HTML elements.
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
        }
    });

    return tags;
}
