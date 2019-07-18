import * as Api from "./Api";
import * as Controls from "./Controls";
import * as Calculate from "./Calculate"
import {Options} from "./Options";

type StringMap<T> = {[key: string]: T};

// color schemes
const basicRainbow = ["red", "orange", "yellow", "green", "blue", "purple"];
const purples = ["#4A148C", "#7B1FA2", "#9C27B0", "#AB47BC", "#CE93D8", "#E1BEE7"]

$(document).ready(async() => {

    Api.getToken();
    Api.getSelectedPlaylist();

    // Get all data for a particular playlist
    const allTrackData = await Api.getTracks();

    // Defines graph preferences
    let artistFreqOptions:Options = {"title":"Artist Frequency", "name":"ArtistFreq", "unit":"songs", "width":500, "height":300, "color": basicRainbow, "nLimit": 10, "sortValue":true, "limit":true};

    // Processes data for frequency of an artist within a playlist
    let artistFreq = Calculate.findArtistFrequency(allTrackData);

    let songDurationOptions = {"title":"Song Durations", "name":"SongDur", "unit":"songs", "width":500, "height":300, "color": purples, "sortValue":false, "limit":false};
    let songDuration15 = Calculate.findSongDurationFrequency(allTrackData, 15);
    let songDuration10 = Calculate.findSongDurationFrequency(allTrackData, 10);
    let songDuration5 = Calculate.findSongDurationFrequency(allTrackData, 5);

    Controls.makeBarGraph("#container", artistFreq, artistFreqOptions); // renders graph
    Controls.makeBarGraph("#container", songDuration15, songDurationOptions);
    
    songDurationOptions["name"] = "SongDur10";
    Controls.makeBarGraph("#container", songDuration10, songDurationOptions);
    
    songDurationOptions["name"] = "SongDur5";
    Controls.makeBarGraph("#container", songDuration5, songDurationOptions);


})



// Options:
    // Legend Preferences
    // title:string;       // Graph title
    // name:string;        // How divs will be labeled for this specific graph
    // xAxis?:string;      // Label for x axis
    // yAxis?:string;      // Label for y axis

    // Dimensions
    // width:number;       // Length of x axis in pixels
    // height:number;      // Length of y axis in pixels