import { useEffect, useId, useMemo } from 'react';
import { useRoof } from './RoofContext';
import { parseRoofChildren } from './utils';
import type { HeadProps } from './types';

/* ------------------------------------------------ */

/**
 * Head component to manage tags in the document head.
 * @param children - React children to be parsed and registered with the provider.
 * @returns null
 */
export function Head({ children }: HeadProps) {
    const { register, unregister } = useRoof();
    const id = useId();

    // Parse children during render
    const tags = useMemo(() => parseRoofChildren(children), [children]);

    // Register with provider
    useEffect(() => {
        register(id, tags);

        return () => {
            unregister(id);
        };
    }, [id, tags, register, unregister]);

    return null;
}
