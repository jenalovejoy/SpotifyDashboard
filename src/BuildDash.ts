/* Constructs the dashboard, calling on Api, Calculate, BarGraph, and StatsSummary to find, organize, and render data */

import * as Api from "./Api";
import * as Calculate from "./Calculate"
import * as Controls from "./Controls";
import * as StatsSummary from "./StatsSummary";

import {BarGraph, BarGraphOptions} from "./BarGraph";
import {StatsSummaryOptions} from "./StatsSummary";
import { Scatterplot, ScatterplotOptions } from "./Scatterplot";

type StringMap<T> = {[key: string]: T};
const mainContainer = "#container"; // the primary page container for control to be appended to

// Color schemes for graphs
// const basicRainbow = ["red", "orange", "yellow", "green", "blue", "purple"];
const purples = ["#4A148C", "#7B1FA2", "#9C27B0", "#AB47BC", "#CE93D8", "#E1BEE7"];
const turquoise = ["#1693A5","#45B5C4","#7ECECA","#A0DED6","#C7EDE8"];
const greens = ["#79bb8c", "#539156", "#61b876", "#90d7bc", "#60b59d"]

$(document).ready(async(): Promise<any> => {

    Api.getToken(); // find authorization token
    const selectedPlaylist: string = Api.getSelectedPlaylist(); // find playlist selected from prior page
    const allTrackData = await Api.getPlaylistTracks(selectedPlaylist); // retrieve all tracks from given playlist

    // Get all data for a particular playlist
    const allPlaylistData = await Api.getPlaylist(selectedPlaylist); // retrieve all selected playlist data

    // Select header information
    const playlistName = allPlaylistData.name;
    const playlistDescription = allPlaylistData.description;

    Controls.postHeader("header", playlistName, playlistDescription);


    if (allPlaylistData.tracks.items.length == 0){
        Controls.postError(mainContainer, {iconType:"exclamation", message:"This playlist has no tracks yet and the dash view cannot be rendered. Please try adding tracks to the playlist and check again."});
        return;
    } else if (allPlaylistData.tracks.items.length < 10){
        Controls.postError(mainContainer, {iconType: "caution", message: "Warning: dashboard will display better with more tracks"})
    }


    // Artist occurrences within playlist - bar graph
    const artistFreqBarGraphOptions: BarGraphOptions = {
        title:"Artist Frequency", 
        name:"ArtistFreq", 
        unit:"songs", 
        xAxisLabel: "Individual Artists",
        yAxisLabel: "Number of Songs",
        width:1000, 
        height:500, 
        color: purples, 
        sortByValue: true,
        limit: {nLimit: 25}
    };

    // Processes data for frequency of an artist within a playlist
    const artistFreq = Calculate.findArtistFrequency(allTrackData);

    // Distribution of song duration - bar graph
    const songDurationBarGraphOptions: BarGraphOptions = {
        title: "Song Durations", 
        name: "SongDur", 
        unit: "songs",
        xAxisLabel: "Duration (10 sec. intervals)",
        yAxisLabel: "Number of Songs",
        width: 650, 
        height: 400, 
        color: turquoise, 
        sortByValue: false
    };

    const songDuration10 = Calculate.findSongDurationFrequency(allTrackData, 10); // compress song durations into buckets of 10-second intervals
    const songDuration5 = Calculate.findSongDurationFrequency(allTrackData, 5);   //                                          5 second intervals
    const songDuration3 = Calculate.findSongDurationFrequency(allTrackData, 3);   //                                          3 second intervals

    const artistFreqGraph: BarGraph = new BarGraph(artistFreqBarGraphOptions);
    artistFreqGraph.render(mainContainer, artistFreq);
    
    songDurationBarGraphOptions.name = "SongDur10";
    const songDuration10secGraph: BarGraph = new BarGraph(songDurationBarGraphOptions);
    songDuration10secGraph.render(mainContainer, songDuration10);
    
    songDurationBarGraphOptions.name = "SongDur5";
    songDurationBarGraphOptions.xAxisLabel = "Duration (5 sec. intervals)";
    const songDuration5secGraph: BarGraph = new BarGraph(songDurationBarGraphOptions);
    songDuration5secGraph.render(mainContainer, songDuration5);

    songDurationBarGraphOptions.name = "SongDur3";
    songDurationBarGraphOptions.xAxisLabel = "Duration (3 sec. intervals)";
    songDurationBarGraphOptions.width = 1500;
    const songDuration3secGraph: BarGraph = new BarGraph(songDurationBarGraphOptions);
    songDuration3secGraph.render(mainContainer, songDuration3);

    // Statistical summary of all song durations
    const songDurationStatsOptions: StatsSummaryOptions = {
        title: "Song Durations (seconds)",
        name: "numArtists",
        unit: "artists",

        width: 500,
        height: 400,
    };

    const songDurations = Calculate.findSongDuration(allTrackData);
    StatsSummary.render(mainContainer, songDurations, songDurationStatsOptions)

    // Number of artists on a given track - bar graph
    const numArtistBarGraphOptions: BarGraphOptions = {
        title: "Number of Artists on One Track",
        name: "numArtists",
        unit: "artists",
        xAxisLabel: "# artists",
        yAxisLabel: "Number of Songs",
        width: 500,
        height: 400,
        color: greens,
        sortByValue: true
    }

    const numberArtistsPerTrack = Calculate.findNumArtistsPerTrackFrequency(allTrackData);
    const numberArtistsTrackGraph: BarGraph = new BarGraph(numArtistBarGraphOptions);
    numberArtistsTrackGraph.render(mainContainer, numberArtistsPerTrack);


    const songPopularityBarGraphOptions: BarGraphOptions = {
        title: "Popularity Score of all Songs",
        name: "songPop",
        unit: "pop. unit",
        xAxisLabel: "Popularity",
        width: 800,
        height: 400,
        color: greens,
        sortByValue: false
    }

    const songPopularityData = Calculate.findSongPopularityFrequency(allTrackData);
    const songPopGraph: BarGraph = new BarGraph(songPopularityBarGraphOptions);
    songPopGraph.render(mainContainer, songPopularityData);

})