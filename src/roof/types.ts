import type { ReactNode, MetaHTMLAttributes, LinkHTMLAttributes } from 'react';

export type MetaProps = MetaHTMLAttributes<HTMLMetaElement>;
export type LinkProps = LinkHTMLAttributes<HTMLLinkElement>;

export interface Tags {
    title: string | null;
    meta: MetaProps[];
    link: LinkProps[];
}

export interface RoofContextValue {
    instances: Map<string, Tags>;
    register: (id: string, tags: Tags) => void;
    unregister: (id: string) => void;
}

export interface RoofProviderProps {
    children: ReactNode;
}

export interface HeadProps {
    children: ReactNode;
}
