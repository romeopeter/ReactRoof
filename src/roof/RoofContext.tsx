import { createContext, useContext, useMemo } from 'react';
import type { RoofContextValue, RoofProviderProps } from './types';

const RoofContext = createContext<RoofContextValue | null>(null);

/**
 * RoofProvider for backward compatibility.
 * In React 19, metadata is hoisted automatically, so this no longer manages state or DOM.
 */
export function RoofProvider({ children }: RoofProviderProps) {
    // No-op implementations for backward compatibility
    const value = useMemo(() => ({
        instances: new Map(),
        register: () => { },
        unregister: () => { },
    }), []);

    return (
        <RoofContext.Provider value={value}>
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
