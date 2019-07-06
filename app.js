const express = require('express')
const app = express()
const port = 3000
const my_client_id = "b899eb7824184b0792708dca91668d49"
const redirect_uri = "http://localhost:" + port + "/callback"

app.get('/login', function(req, res) {
var scopes = 'playlist-read-private playlist-read-collaborative';


res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=token' +
  '&client_id=' + my_client_id +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/callback', function(req, res) {
    let code = req.query.code;
    res.send('Success!');


});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// http://localhost:3000/callback?code=AQDdDRiBmxP421J_n6j3_KylSkuRE1TPX9W81NPuRNv9bTvTQkCtzZDWiqN2NmfXJ8NHEUBI6BgDRjxoHMmUtkqn9JIAR-zragPCuuIqnDkNbcU2VQl59ZyR65vyxS0QqBAudc1mw0xdCuz5wqfVqZ47zWkv3TcJdU5hiNwC_AAohsndrbylrccismbM_2EAZ99cEHhvX03u88H-UH47ZkMr12H_dRdGm2SmAiL8FIw5IgJE2eW_mQsq78tqEK3IGT7NPQuaZabxlQ