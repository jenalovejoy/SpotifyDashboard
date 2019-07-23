import * as Api from "./Api";


$(document).ready(async(): Promise<any> => {

    Api.getToken();
    
    const allPlaylistData = await Api.getPlaylistIDs();

    for (let i = 0; i < allPlaylistData.length; i++){

        let playlistName = allPlaylistData[i].name;
        let playlistID = allPlaylistData[i].id;
        let playlistImageURL = await Api.getPlaylistImage(playlistID);
        let playlistCard = `<div class="playlistCard">
                            <a href=\"./playlistDash/${playlistID}\">
                            <img class=\"playlistImage\" src=\"${playlistImageURL}\" title="${playlistName}">
                            <div class="playlistText">${playlistName}</div>
                            </a>
                            </div>`
        
        $("#playlists").append($(playlistCard));
    }
    
    
})



