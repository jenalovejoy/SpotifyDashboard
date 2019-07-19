const baseURL = "https://api.spotify.com/"
const myPlaylistsURL = "v1/me/playlists"
const playlistsURL = "v1/playlists/"
let accessToken = "";
let selectedPlaylist = "";

export function getToken(): void{
    var accessTokenFormat = new RegExp("access_token=([^&]*)")
    if (window.location.hash !== ""){
        accessToken = accessTokenFormat.exec(window.location.hash)[1];
        document.cookie = `access_token=${accessToken}`;
        
    } else {
        let cookie = document.cookie;
        accessToken = accessTokenFormat.exec(cookie)[1];
    }

}

export async function getSelectedPlaylist(): void{
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
    return await makeCall(myPlaylistsURL);
}

export async function getPlaylistImage(playlistID:string): Promise<any>{
    let url = playlistsURL + playlistID + '/images';
    let data =  await makeCall(url)
    return data[0] && data[0].url;
}

export async function getTracks(): Promise<any>{
    // https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    let url = playlistsURL + selectedPlaylist + "/tracks"
    return await makeCall(url);
}

