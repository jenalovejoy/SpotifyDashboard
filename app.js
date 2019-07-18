const express = require('express')
const app = express()
const port = 3000
const my_client_id = "b899eb7824184b0792708dca91668d49"
const redirect_uri = "http://localhost:" + port + "/callback"
app.use(express.static('public'))


app.get('/login', (req, res) => {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
    });

app.get('/callback', (req, res) => {
    let code = req.query.code;
    let path = require('path')
    res.sendFile('./public/allPlaylists.html', {
        root: '.'
    })
});

app.get('/playlistDash/:playlistID', (req, res) => {
    let code = req.query.code;
    let path = require('path')
    let playlistID = req.params.playlistID;
    res.sendFile('./public/dashboard.html', {
        root: '.'
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

