import { Album } from "./Album";
import { Artist } from "./Artist";
import { ExternalURL } from "./ExternalURL";
import { TrackLink } from "./TrackLink";

export interface Track {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
    };
    external_urls: ExternalURL;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: TrackLink;
    restrictions: any; // Create type
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
}