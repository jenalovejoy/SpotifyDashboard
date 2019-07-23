/* Constructs the dashboard, calling on Api, Calculate, and Control to find, organize, and present data */

import * as Api from "./Api";
import * as Controls from "./Controls";
import * as Calculate from "./Calculate"
import {Options} from "./Options";

type StringMap<T> = {[key: string]: T};
const mainContainer = "#container"; // the primary page container for control to be appended to

// Color schemes for graphs
const basicRainbow = ["red", "orange", "yellow", "green", "blue", "purple"];
const purples = ["#4A148C", "#7B1FA2", "#9C27B0", "#AB47BC", "#CE93D8", "#E1BEE7"];
const turquoise = ["#1693A5","#45B5C4","#7ECECA","#A0DED6","#C7EDE8"];
const greens = ["#79bb8c", "#539156", "#61b876", "#90d7bc", "#60b59d"]

$(document).ready(async(): Promise<any> => {

    Api.getToken(); // find authorization token
    Api.getSelectedPlaylist(); // find playlist selected from prior page
    let allTrackData = await Api.getPlaylistTracks(); // retrieve all tracks from given playlist

    // Get all data for a particular playlist
    const allPlaylistData = await Api.getPlaylist(); // retrieve all selected playlist data

    // Select header information
    const playlistName = allPlaylistData.name;
    const playlistDescription = allPlaylistData.description;

    Controls.postHeader("#header", playlistName, playlistDescription);

    /* Format is as follows -> determine options, arrange/transform data, render graph with options and formatted data */

    // Artist occurrences within playlist - bar graph
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

    // Distribution of song duration - bar graph
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

    let songDuration10 = Calculate.findSongDurationFrequency(allTrackData, 10); // compress song durations into buckets of 10-second intervals
    let songDuration5 = Calculate.findSongDurationFrequency(allTrackData, 5);   //                                          5 second intervals
    let songDuration3 = Calculate.findSongDurationFrequency(allTrackData, 3);   //                                          3 second intervals

    Controls.makeBarGraph(mainContainer, artistFreq, artistFreqOptions); 
    
    songDurationOptions["name"] = "SongDur10";
    Controls.makeBarGraph(mainContainer, songDuration10, songDurationOptions);
    
    songDurationOptions["name"] = "SongDur5";
    songDurationOptions.xAxis = "Duration (5 sec. intervals)";
    Controls.makeBarGraph(mainContainer, songDuration5, songDurationOptions);

    songDurationOptions["name"] = "SongDur3";
    songDurationOptions.xAxis = "Duration (3 sec. intervals)";
    songDurationOptions.width = 1500;
    Controls.makeBarGraph(mainContainer, songDuration3, songDurationOptions);

    // Statistical summary of all song durations
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

    // Number of artists on a given track - bar graph
    let numArtistOptions: Options = {
        "title": "Number of Artists on One Track", 
        "name": "numArtists", 
        "unit": "artists",
        "xAxis": "# artists",
        "yAxis": "Number of Songs",
        "width": 500, 
        "height": 400, 
        "color": greens, 
        "sortValue": false
    }

    let numberArtistsPerTrack = Calculate.findNumArtistsPerTrackFrequency(allTrackData);
    Controls.makeBarGraph(mainContainer, numberArtistsPerTrack, numArtistOptions);

})