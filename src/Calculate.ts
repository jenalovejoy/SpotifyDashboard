import { StatsSummary } from "./Stats";

type StringMap<T> = {[key: string]: T};
type NumberMap<T> = {[key: number]: T};

const MS_IN_MIN = 60000;
const MS_IN_SEC = 1000;

export function findArtistFrequency(allTrackData: any): StringMap<number>{
    let individualArtistFreq = {}

    let size = allTrackData.length;

    for (let i = 0; i < size; i++){
        for (let a of allTrackData[i].track.artists){
            let name = a.name;
            if (!(name in individualArtistFreq)){
                individualArtistFreq[name] = 1;
            } else {
                let count = individualArtistFreq[name] + 1;
                individualArtistFreq[name] = count;
            }
        }
    }
    return individualArtistFreq;
}

export function findNumArtistsPerTrackFrequency(allTrackData: any): StringMap<number>{
    let numberArtistsFreq = {}

    let size = allTrackData.length;

    for (let i = 0; i < size; i++){
        let numTrackArtists = 0;
        for (let a of allTrackData[i].track.artists){
            numTrackArtists++;
        }
        if (!(numTrackArtists in numberArtistsFreq)){
            numberArtistsFreq[numTrackArtists] = 1;
        } else {
            let count = numberArtistsFreq[numTrackArtists] + 1;
            numberArtistsFreq[numTrackArtists] = count;
        }
    }
    return numberArtistsFreq;
}

export function findSongDuration(allTrackData: any[]): number[] {

    let songDuration: number[] = [];

    allTrackData.forEach(trackData => {
        let d: number = trackData.track.duration_ms;
        let durationSeconds = (d / MS_IN_SEC);

        songDuration.push(durationSeconds);
    })

    return songDuration;
}

function compressSongDuration(durations: number[], compressFactor: number): number[]{

    let compressedDuration: number[] = [];

    for (let k of durations){
        let durationSeconds: number = k;
        durationSeconds = compressTimes(durationSeconds, compressFactor);
        compressedDuration.push(durationSeconds);
    }

    return compressedDuration;

}

export function findSongDurationFrequency(allTrackData: any, compressFactor: number): StringMap<number>{

    let songDurationRaw = findSongDuration(allTrackData);
    let songDurationCompressed = compressSongDuration(songDurationRaw, compressFactor);
    let rawDurationMap: NumberMap<number> = buildFrequency(songDurationCompressed);
    let songDurationsFormatted: StringMap<number> = {};

    for (let rawDuration in rawDurationMap){
        let stringDuration = adjustTimeLabelRange(parseInt(rawDuration), compressFactor);
        songDurationsFormatted[stringDuration] = rawDurationMap[rawDuration];
    }
    
    return songDurationsFormatted;
}

function buildFrequency(data: any[]): {} {

    let map = {}
    for (let d of data){
        if (!(d in map)){
            map[d] = 1;
        } else {
            let count = map[d];
            map[d] = count + 1;
        }
    }

    return map;
}

function compressTimes(time: number, compressFactor: number): number{ 

    // force factor of 60
    compressFactor = factorOf60(compressFactor);

    // compressFactor: chunks to break into
    let minutes = Math.floor(time / 60);
    let seconds = time % 60; // breaks out just the seconds
    let interval = Math.floor(seconds / compressFactor);
    let final: number = (minutes * 60) + (interval * compressFactor);

    return final;
}



function factorOf60(n: number): number{
    let factors = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
    let remainder = 60 % n;

    if (remainder == 0){
        return n;
    }

    let difference: number[];

    for (let i = 0; i < 13; i++){
        difference[i] = Math.abs(factors[i] - n);
    }

    let index = Math.min(...difference); // FIX THIS
    return factors[index];

}

function adjustTimeLabelRange(seconds: number, compressFactor: number): string{

    let startMinutes = Math.floor(seconds / 60);
    let startSeconds = seconds % 60;

    let endMinutes = startMinutes;
    let endSeconds = startSeconds + compressFactor;

    if (endSeconds > 60){
        endMinutes += 1;
        endSeconds = 0;
    }

    return `${startMinutes}:${fixSeconds(startSeconds)}-${endMinutes}:${fixSeconds(endSeconds)}`;
}

export function adjustTimeUnitsMap(map: {}): {}{

    for (let label in map){
        let time = map[label];
        let minutes = Math.floor(time / 60);
        let rawSeconds = time % 60;

        let seconds = parseInt(rawSeconds.toFixed(2));

        map[label] = `${minutes}:${fixSeconds(seconds)}`;
    }
    
    return map;
}

function fixSeconds(n: number): string{
    if (n < 10){
        return "0" + n;
    }

    return n + "";
}