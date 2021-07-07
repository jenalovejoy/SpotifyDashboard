import { User } from "./User";
import { Track } from "./Track";

export interface PlaylistTrack {
    added_at: Date;
    added_by: User;
    
    is_local: false;
    track: Track;
}