const path = require('path');

module.exports = {
    entry: {
        playlistView: './src/LaunchPlaylists.js', 
        dashboard: './src/BuildDash.js'}
    ,
    output: {
        publicPath: path.resolve(__dirname, "public"),
        path: path.resolve(__dirname, "public"),
        filename: '[name].bundle.js',

    }
}; 
