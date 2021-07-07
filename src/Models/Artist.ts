import { ExternalURL } from "./ExternalURL";

export interface Artist {
    external_urls: ExternalURL;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}