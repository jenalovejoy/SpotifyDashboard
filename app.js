const express = require('express');
const app = express();
const port = 3000;
const myClientId = "b899eb7824184b0792708dca91668d49";
const redirectUri = "http://localhost:" + port + "/callback";
app.use(express.static('public'));


app.get('/login', (req, res) => {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + myClientId +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirectUri));
});

app.get('/callback', (req, res) => {
    const code = req.query.code;
    const path = require('path');
    res.sendFile('./public/allPlaylists.html', {
        root: '.'
    })
});

app.get('/playlistDash/:playlistID', (req, res) => {
    const code = req.query.code;
    const path = require('path')
    const playlistID = req.params.playlistID;
    res.sendFile('./public/dashboard.html', {
        root: '.'
    })
})

app.listen(port, () => console.log(`Dashboard is available on port ${port}/login`))

