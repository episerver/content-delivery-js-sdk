export declare enum ContextMode {
    Default = 0,
    Preview = 1,
    Edit = 2
}
export interface Language {
    link: string;
    displayName: string;
    name: string;
}
export interface ContentLink {
    guidValue: string;
    url: string;
    language: Language;
}
export interface ContentData {
    contentLink: ContentLink;
    parentLink: ContentLink;
    contentType: {
        name: string;
        guidValue: string;
        base: string;
    };
    language: Language;
    existingLanguages: Array<Language>;
    created: Date;
    changed: Date;
    saved: Date;
    startPublish: Date;
    name: string;
}
export interface PageData extends ContentData {
    url: string;
    routeSegment: string;
    category: Array<string>;
}
