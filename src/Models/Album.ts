import { ExternalURL } from "./ExternalURL";
import { Artist } from "./Artist";
import { Image } from "./Image";

export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: ExternalURL;
    href: string;
    id: string;
    images: Image[];
    name: string;
    type: string;
    uri: string;
}