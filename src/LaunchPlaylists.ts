import * as Api from "./Api";
import * as Controls from "./Controls";
import { User } from "./Models/User";


$(document).ready(async(): Promise<any> => {

    Api.getToken();
    
    const allPlaylistData = await Api.getPlaylistData();
    const allUserData: User = await Api.getUserInformation();

    let name;
    if (allUserData.display_name != null){
        name = allUserData.display_name + "'s";
    } else {
        name = "Your"
    }

    Controls.postHeader("header", `${name} Playlists`, "");

    if (allPlaylistData.items.length == 0){
        Controls.postError("#playlists", {iconType: "exclamation", message: "This account has no playlists to view. Create a playlist to view dashboard."});
        return;
    }
    
    for (const playlist of allPlaylistData.items){
        const playlistName = playlist.name;
        const playlistID = playlist.id;
        let playlistImageUrl;

        if (playlist.images[0] == undefined){
            playlistImageUrl =  "https://developer.spotify.com/assets/branding-guidelines/icon1@2x.png";
        } else {
            playlistImageUrl = playlist.images[0].url;
        }
        const playlistCard = `
                            <div class="playlistCard">
                                <a href="./playlistDash/${playlistID}">
                                    <img class="playlistImage" src="${playlistImageUrl}" title="${playlistName}">
                                    <div class="playlistText">${playlistName}</div>
                                </a>
                            </div>`;
        
        $("#playlists").append($(playlistCard));
    }
    
})



