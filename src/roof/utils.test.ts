import { describe, it, expect } from 'vitest';
import { parseRoofChildren } from './utils';
import React from 'react';

// Mock specific Roof components for testing parsing structure
// Note: We are testing the parsing logic, so passing objects that look like React elements 
// is the goal, but using React.createElement is safer to match React internals.

describe('parseRoofChildren', () => {
    it('should return empty tags for empty children', () => {
        const result = parseRoofChildren(null);
        expect(result).toEqual({
            title: null,
            meta: [],
            link: []
        });
    });

    it('should extract title from a simple string child', () => {
        const children = React.createElement('title', {}, 'My Page Title');
        const result = parseRoofChildren(children);
        expect(result.title).toBe('My Page Title');
    });

    it('should extract title from an array of strings', () => {
        // e.g. <title>{'My '}{'Title'}</title> -> children is array
        const children = React.createElement('title', {}, ['My ', 'Title']);
        const result = parseRoofChildren(children);
        expect(result.title).toBe('My Title');
    });

    it('should extract single meta tag', () => {
        const children = React.createElement('meta', { name: 'description', content: 'test' });
        const result = parseRoofChildren(children);
        expect(result.meta).toHaveLength(1);
        expect(result.meta[0]).toEqual({ name: 'description', content: 'test' });
    });

    it('should extract multiple meta tags', () => {
        const children = [
            React.createElement('meta', { key: 1, name: 'description', content: 'd' }),
            React.createElement('meta', { key: 2, property: 'og:title', content: 't' })
        ];
        const result = parseRoofChildren(children);
        expect(result.meta).toHaveLength(2);
        expect(result.meta[0]).toEqual({ name: 'description', content: 'd' });
        expect(result.meta[1]).toEqual({ property: 'og:title', content: 't' });
    });

    it('should extract link tags', () => {
        const children = React.createElement('link', { rel: 'canonical', href: 'http://example.com' });
        const result = parseRoofChildren(children);
        expect(result.link).toHaveLength(1);
        expect(result.link[0]).toEqual({ rel: 'canonical', href: 'http://example.com' });
    });

    it('should ignore non-roof elements (div, span, etc)', () => {
        const children = [
            React.createElement('title', { key: 't' }, 'Real Title'),
            React.createElement('div', { key: 'd' }, 'Content'),
            React.createElement('meta', { key: 'm', name: 'foo', content: 'bar' })
        ];
        const result = parseRoofChildren(children);
        expect(result.title).toBe('Real Title');
        expect(result.meta).toHaveLength(1);
        // Should not have any other properties or pollution
    });

    it('should handle nested structures if possible? (Current implementation is flat)', () => {
        // The current implementation uses React.Children.forEach, which typically handles flat lists 
        // or a single element. It does NOT recursively traverse by default unless implemented.
        // Let's verify flat behavior is expected.
        const children = [
            React.createElement('title', { key: 't' }, 'Flat Title')
        ];
        const result = parseRoofChildren(children);
        expect(result.title).toBe('Flat Title');
    });
});
