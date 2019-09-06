import { SpotifyList } from "./Models/SpotifyList";
import { PlaylistTrack } from "./Models/PlaylistTrack";
import { PlaylistObject } from "./Models/PlaylistObject";
import { User } from "./Models/User";

const baseURL = "https://api.spotify.com/"
const myUserURL = "v1/me/"
const myPlaylistsURL = "v1/me/playlists/"
const playlistsURL = "v1/playlists/"
let accessToken = "";
// let selectedPlaylist = "";
const PLAYLIST_LIMIT = 60;

export function getToken(): void{
    if (window.location.hash !== ""){
        var accessTokenFormat = new RegExp("access_token=([^&]*)")
        accessToken = accessTokenFormat.exec(window.location.hash)[1];
        window.sessionStorage.setItem("accessToken", accessToken);
        
    } else {
        accessToken = window.sessionStorage.getItem("accessToken");
    }
}

export function getSelectedPlaylist(): string {
    const playlistIDFormat = new RegExp("playlistDash.(.*)")
    return playlistIDFormat.exec(window.location.pathname)[1];
}


export async function makeCall<T>(url: string): Promise<T> {
    const data = await $.ajax({
        url : baseURL + url,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    return data;
}

export async function getUserInformation(): Promise<any> {
    const data: User = await makeCall(myUserURL);
    return data;
}

export async function getPlaylistData(): Promise<any> {
    const startUrl = myPlaylistsURL; 

    let data: SpotifyList<PlaylistObject> = await makeCall(startUrl);
    let playlists = data.items;
    let nextPage = data.next;
    let count = data.items.length;

    while(nextPage && count < PLAYLIST_LIMIT) {
        const url = getPlaylistURL(nextPage);
        data = await makeCall(url);
        playlists = playlists.concat(data.items);
        nextPage = data.next;
        count = data.items.length;
    }
    data.items = playlists;
    return data;
}

export async function getPlaylistImage(playlistId: string): Promise<any>{
    const url = playlistsURL + playlistId + '/images'; 
    const data =  await makeCall(url)
    return data[0] && data[0].url;
}

export async function getPlaylist(selectedPlaylist: string): Promise<any>{
    const url = playlistsURL + selectedPlaylist 
    return await makeCall(url);
}

export async function getPlaylistTracks(selectedPlaylist: string): Promise<any> {
    const startUrl = playlistsURL + selectedPlaylist + "/tracks";

    let data: SpotifyList<PlaylistTrack> = await makeCall(startUrl);
    let tracks = data.items;
    let nextPage = data.next;
    while(nextPage) {
        const url = startUrl + getTracksURL(nextPage);
        data = await makeCall(url);
        tracks = tracks.concat(data.items);
        nextPage = data.next;
    }
    return tracks;
}

function getPlaylistURL(intialURL: string): string{
    var urlFormat = new RegExp("com/(.*)");
    return urlFormat.exec(intialURL)[1]

}

function getTracksURL(intialURL: string): string{
    var urlFormat = new RegExp("/tracks(.*)");
    return urlFormat.exec(intialURL)[1]

}