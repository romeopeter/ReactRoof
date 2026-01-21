import type { HeadProps } from './types';

/**
 * Head component to manage tags in the document head.
 * In React 19, this simply renders children which are automatically hoisted.
 * @param children - React children (title, meta, link, script)
 */
export function Head({ children }: HeadProps) {
    return <>{children}</>;
}
