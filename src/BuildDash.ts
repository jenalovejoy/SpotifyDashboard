import * as Api from "./Api";
import * as Controls from "./Controls";
import * as Calculate from "./Calculate"
import {Options} from "./Options";

type StringMap<T> = {[key: string]: T};
const mainContainer = "#container";

// color schemes
const basicRainbow = ["red", "orange", "yellow", "green", "blue", "purple"];
const purples = ["#4A148C", "#7B1FA2", "#9C27B0", "#AB47BC", "#CE93D8", "#E1BEE7"];
const turquoise = ["#1693A5","#45B5C4","#7ECECA","#A0DED6","#C7EDE8"];
const greens = ["#79bb8c", "#539156", "#61b876", "#90d7bc", "#60b59d"]

$(document).ready(async(): Promise<any> => {

    Api.getToken();
    Api.getSelectedPlaylist();
    let allTrackData = await Api.getPlaylistTracks();

    // Get all data for a particular playlist
    const allPlaylistData = await Api.getPlaylist();

    const playlistName = allPlaylistData.name;
    const playlistDescription = allPlaylistData.description;

    Controls.postHeader("#header", playlistName, playlistDescription);

    // Defines graph preferences
    let artistFreqOptions: Options = {
        "title":"Artist Frequency", 
        "name":"ArtistFreq", 
        "unit":"songs", 
        "xAxis": "Individual Artists",
        "yAxis": "Number of Songs",
        "width":1000, 
        "height":500, 
        "color": purples, 
        "sortValue":true,
        "limit": {nLimit: 25}
    };

    // Processes data for frequency of an artist within a playlist
    let artistFreq = Calculate.findArtistFrequency(allTrackData);

    let songDurationOptions: Options = {
        "title": "Song Durations", 
        "name": "SongDur", 
        "unit": "songs",
        "xAxis": "Duration (10 sec. intervals)",
        "yAxis": "Number of Songs",
        "width": 650, 
        "height": 400, 
        "color": turquoise, 
        "sortValue": false
    };

    let songDuration10 = Calculate.findSongDurationFrequency(allTrackData, 10);
    let songDuration5 = Calculate.findSongDurationFrequency(allTrackData, 5);
    let songDuration3 = Calculate.findSongDurationFrequency(allTrackData, 3);

    Controls.makeBarGraph(mainContainer, artistFreq, artistFreqOptions); // renders graph
    
    songDurationOptions["name"] = "SongDur10";
    Controls.makeBarGraph(mainContainer, songDuration10, songDurationOptions);
    
    songDurationOptions["name"] = "SongDur5";
    songDurationOptions.xAxis = "Duration (5 sec. intervals)";
    Controls.makeBarGraph(mainContainer, songDuration5, songDurationOptions);

    songDurationOptions["name"] = "SongDur3";
    songDurationOptions.xAxis = "Duration (3 sec. intervals)";
    songDurationOptions.width = 1500;
    Controls.makeBarGraph(mainContainer, songDuration3, songDurationOptions);

    let songDurationStatsOptions: Options = {
        "title": "Song Durations", 
        "name": "SongDur", 
        "unit": "songs",
        "xAxis": "Duration (10 sec. intervals)",
        "yAxis": "Number of Songs",
        "width": 200, 
        "height": 100, 
        "sortValue": false
    };

    let songDurations = Calculate.findSongDuration(allTrackData);
    Controls.makeStatsSummary(mainContainer, songDurations, songDurationStatsOptions)

    let numArtistOptions: Options = {
        "title": "Number of Artists on One Track", 
        "name": "numArtists", 
        "unit": "artists",
        "xAxis": "# artists",
        "yAxis": "Number of Songs",
        "width": 500, 
        "height": 300, 
        "color": greens, 
        "sortValue": false
    }

    let numberArtistsPerTrack = Calculate.findNumArtistsPerTrackFrequency(allTrackData);
    Controls.makeBarGraph(mainContainer, numberArtistsPerTrack, numArtistOptions);

})