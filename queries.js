$(document).ready(function(){

    var hash = window.location.hash
    var accessToken = parseHash(hash)
    console.log(accessToken)
    
    $.ajax({
        url : 'https://api.spotify.com/v1/me/playlists',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer' + accessToken
        },

        success: function(data){
            console.log(data);
        }
    });

})

function parseHash(hash){

    var accessToken = new RegExp("access_token=([^&]*)")
    return accessToken.test(hash)

}