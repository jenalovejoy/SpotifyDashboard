import { ExternalURL } from "./ExternalURL";
import { Image } from "./Image";
import { User } from "./User";
import { Track } from "./Track";

export interface PlaylistObject {

    collaborative: boolean;
    external_urls: ExternalURL;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: User;
    Public: boolean | null;
    snapshot_id: string;
    tracks: Track;
    type: string;
    uri: string;
    
}