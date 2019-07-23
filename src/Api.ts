const baseURL = "https://api.spotify.com/"
const myPlaylistsURL = "v1/me/playlists"
const playlistsURL = "v1/playlists/"
let accessToken = "";
let selectedPlaylist = "";

export function getToken(): void{
    var accessTokenFormat = new RegExp("access_token=([^&]*)")
    if (window.location.hash !== ""){
        accessToken = accessTokenFormat.exec(window.location.hash)[1];
        window.localStorage.setItem("accessToken", accessToken);
        
    } else {
        accessToken = window.localStorage.getItem("accessToken");
    }

}

export async function getSelectedPlaylist(): Promise<any> {
    let playlistIDFormat = new RegExp("playlistDash.(.*)")
    selectedPlaylist = playlistIDFormat.exec(window.location.pathname)[1];
}


export async function makeCall(url: string): Promise<any> {
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

export async function getPlaylistIDs(): Promise<any> {
    let startUrl = myPlaylistsURL; 

    let data = await makeCall(startUrl);
    let playlists = data.items;
    let nextPage = data.next;
    let count = data.items.length;

    while(nextPage && count < 60) {
        let url = getPlaylistURL(nextPage);
        data = await makeCall(url);
        playlists = playlists.concat(data.items);
        nextPage = data.next;
        count = playlists.length;
    }
    return playlists;
}

export async function getPlaylistImage(playlistID: string): Promise<any>{
    let url = playlistsURL + playlistID + '/images';
    let data =  await makeCall(url)
    return data[0] && data[0].url;
}

export async function getPlaylist(): Promise<any>{
    let url = playlistsURL + selectedPlaylist 
    return await makeCall(url);
}

export async function getPlaylistTracks(): Promise<any> {
    let startUrl = playlistsURL + selectedPlaylist + "/tracks";

    let data = await makeCall(startUrl);
    let tracks = data.items;
    let nextPage = data.next;
    while(nextPage) {
        let url = startUrl + getTracksURL(nextPage);
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