import * as Api from "./Api";


$(document).ready(async() => {

    Api.getToken();
    
    const allPlaylistData = await Api.getPlaylistIDs();

    for (let i = 0; i < allPlaylistData.items.length; i++){

        let playlistName = allPlaylistData.items[i].name;
        let playlistID = allPlaylistData.items[i].id;
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



