import { useEffect, useId, useMemo } from 'react';
import { useRoof } from './RoofContext';
import { parseRoofChildren } from './utils';
import type { RoofProps } from './types';

export function Roof({ children }: RoofProps) {
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

    return null; // Renders nothing to the DOM
}
