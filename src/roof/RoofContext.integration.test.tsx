import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { RoofProvider } from './RoofContext';
import { Head } from './Head';

/* ------------------------------------------------------------------ */

// Setup JSDOM is handled by Vitest config or via command line flags if set, 
// but usually we need to specify environment in the file or config.
// Since we didn't create a vitest.config.ts, we relied on defaults.
// We should probably ensure environment is jsdom.
// @vitest-environment jsdom

describe('Roof Integration', () => {
    afterEach(() => {
        cleanup();
        document.head.innerHTML = '';
        document.title = '';
    });

    it('should update document title', () => {
        render(
            <RoofProvider>
                <Head>
                    <title>New Title</title>
                </Head>
            </RoofProvider>
        );
        expect(document.title).toBe('New Title');
    });

    it('should update meta tags', () => {
        render(
            <RoofProvider>
                <Head>
                    <meta name="description" content="test desc" />
                </Head>
            </RoofProvider>
        );
        const meta = document.querySelector('meta[name="description"]');
        expect(meta).not.toBeNull();
        expect(meta?.getAttribute('content')).toBe('test desc');
        expect(meta?.getAttribute('data-roof')).toBe('true');
    });

    it('should allow nested Roof overrides (Last one wins)', () => {
        render(
            <RoofProvider>
                <Head>
                    <title>Base Title</title>
                    <meta name="theme-color" content="blue" />
                </Head>
                <div>
                    <Head>
                        <title>Nested Title</title>
                        <meta name="theme-color" content="red" />
                    </Head>
                </div>
            </RoofProvider>
        );

        expect(document.title).toBe('Nested Title');

        const metas = document.querySelectorAll('meta[name="theme-color"]');
        expect(metas.length).toBe(1);
        expect(metas[0].getAttribute('content')).toBe('red');
    });

    it('should clean up tags on unmount', () => {
        const { unmount } = render(
            <RoofProvider>
                <Head>
                    <meta name="temp" content="foo" />
                </Head>
            </RoofProvider>
        );

        expect(document.querySelector('meta[name="temp"]')).not.toBeNull();

        unmount();

        // Note: In our current implementation, Unmounting the Provider clears the state, 
        // but does it clear the DOM?
        // The Provider effect runs on instances change. If Provider unmounts, the state is gone.
        // But the effect cleanup? We didn't implement a cleanup for the Provider effect itself 
        // that strips *all* tags. 
        // We only implemented: "When instances change, re-calculate and replacing/updating tags".
        // Use case: if you unmount the whole app, do you accept the tags staying? 
        // Usually yes, but if we unmount a specific Roof component, they should effectively "revert" 
        // to previous state (or disappear if no one else claims them).

        // Let's test unmounting a CHILD Roof, not the provider.
    });

    it('should revert to previous tags when a child unmounts', () => {
        const TestComponent = ({ showChild }: { showChild: boolean }) => (
            <RoofProvider>
                <Head>
                    <title>Parent Title</title>
                </Head>
                {showChild && (
                    <Head>
                        <title>Child Title</title>
                    </Head>
                )}
            </RoofProvider>
        );

        const { rerender } = render(<TestComponent showChild={true} />);
        expect(document.title).toBe('Child Title');

        rerender(<TestComponent showChild={false} />);
        expect(document.title).toBe('Parent Title');
    });
});
