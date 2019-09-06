import { PlaylistTrack } from "./Models/PlaylistTrack";

type StringMap<T> = {[key: string]: T};
type NumberMap<T> = {[key: number]: T};

const MS_IN_MIN = 60000;
const MS_IN_SEC = 1000;

export function findArtistFrequency(allTrackData: PlaylistTrack[]): StringMap<number>{
    const individualArtistFreq = {}

    for (const track of allTrackData){
        for (const artist of track.track.artists){
            const name = artist.name;
            if (!(name in individualArtistFreq)){
                individualArtistFreq[name] = 1;
            } else {
                individualArtistFreq[name] += 1;
            }
        }
    }
    return individualArtistFreq;
}

export function findNumArtistsPerTrackFrequency(allTrackData: PlaylistTrack[]): StringMap<number>{
    const numberArtistsFreq = {}

    for (const track of allTrackData){
        let numTrackArtists = 0;
        for (const artist of track.track.artists){
            numTrackArtists++;
        }
        if (!(numTrackArtists in numberArtistsFreq)){
            numberArtistsFreq[numTrackArtists] = 1;
        } else {
            const count = numberArtistsFreq[numTrackArtists] + 1;
            numberArtistsFreq[numTrackArtists] = count;
        }
    }
    return numberArtistsFreq;
}

export function findSongPopularityFrequency(allTrackData: PlaylistTrack[]): StringMap<number>{
    const popularities = findSongPopularity(allTrackData);
    return buildFrequency(popularities);
}

export function findSongDuration(allTrackData: PlaylistTrack[]): number[] {

    return allTrackData.map(track => track.track.duration_ms / MS_IN_SEC);
}

function compressSongDuration(durations: number[], compressFactor: number): number[]{

    return durations.map(duration => compressTimes(duration, compressFactor));

}

export function findSongDurationFrequency(allTrackData: PlaylistTrack[], compressFactor: number): StringMap<number>{

    const songDurationRaw = findSongDuration(allTrackData);
    const songDurationCompressed = compressSongDuration(songDurationRaw, compressFactor);
    const rawDurationMap: NumberMap<number> = buildFrequency(songDurationCompressed);
    const songDurationsFormatted: StringMap<number> = {};

    for (const rawDuration in rawDurationMap){
        const stringDuration = adjustTimeLabelRange(parseInt(rawDuration), compressFactor);
        songDurationsFormatted[stringDuration] = rawDurationMap[rawDuration];
    }
    
    return songDurationsFormatted;
}

function findSongPopularity(allTrackData: PlaylistTrack[]): string[] {
    return allTrackData.map(track => fixSingleDigit(track.track.popularity));
}

function buildFrequency(data: any[]): {} {

    const map = {}
    for (const d of data){
        if (!(d in map)){
            map[d] = 1;
        } else {
            const count = map[d];
            map[d] = count + 1;
        }
    }

    return map;
}

/**
 * Converts a song duration in seconds into intervals of a given length, rounding down
 * For example, if the compressFactor is 5, 1-4.9 seconds will return 1, 5-9.9 will return 5
 * @param time how long the song is in seconds
 * @param compressFactor how long each interval will be
 */
function compressTimes(time: number, compressFactor: number): number{ 

    // compressFactor: chunks to break into
    const minutes = Math.floor(time / 60);
    const seconds = time % 60; // breaks out just the seconds
    const interval = Math.floor(seconds / compressFactor);
    const final: number = (minutes * 60) + (interval * compressFactor);

    return final;
}

/**
 * Converts a compressed song duration into the more accurate string label with a start and stop time
 * @param seconds how many seconds are in the song
 * @param compressFactor the length of the interval
 */
function adjustTimeLabelRange(seconds: number, compressFactor: number): string{

    const startMinutes = Math.floor(seconds / 60);
    const startSeconds = seconds % 60;

    let endMinutes = startMinutes;
    let endSeconds = startSeconds + compressFactor;

    if (endSeconds > 60){
        endMinutes += 1;
        endSeconds = 0;
    }

    return `${startMinutes}:${fixSingleDigit(startSeconds)}-${endMinutes}:${fixSingleDigit(endSeconds)}`;
}

export function adjustTimeUnitsMap(map: {}): {}{

    for (const label in map){
        const time = map[label];
        const minutes = Math.floor(time / 60);
        const rawSeconds = time % 60;

        const seconds = parseInt(rawSeconds.toFixed(2));

        map[label] = `${minutes}:${fixSingleDigit(seconds)}`;
    }
    
    return map;
}

function fixSingleDigit(n: number): string{
    if (n < 10){
        return "0" + n;
    }

    return n + "";
}