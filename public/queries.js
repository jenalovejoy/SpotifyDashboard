$(document).ready(function(){

    var hash = window.location.hash
    var accessToken = parseHash(hash)

    $.ajax({
        url : 'https://api.spotify.com/v1/me/playlists',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },

        success: function(data){
            for (let i = 0; i < data.items.length; i++){
                document.write("name: " + data.items[i].name)
            }
        }
    });
})

function parseHash(hash){

    var accessToken = new RegExp("access_token=([^&]*)")
    return accessToken.exec(hash)[1]

}