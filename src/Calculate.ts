type StringMap<T> = {[key: string]: T};

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

export function findSongDurationFrequency(allTrackData: any, compressFactor: number): StringMap<number>{

    let songDuration = {};
    let size = allTrackData.length;

    for (let i = 0; i < size; i++){
        let d: number= allTrackData[i].track.duration_ms;
        let durationSeconds = (d / MS_IN_SEC);
        durationSeconds = compressTimes(durationSeconds, compressFactor);

        if (!(durationSeconds in songDuration)){
            songDuration[durationSeconds] = 1;
        } else {
            let count = songDuration[durationSeconds] + 1;
            songDuration[durationSeconds] = count;
        }
    
    }
    return adjustTimeLabels(songDuration, compressFactor);
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

function adjustTimeLabels(data: StringMap<number>, compressFactor: number): StringMap<number>{

    let adjusted = {};
    for (let key in data){
        let seconds = parseInt(key);
        let startMinutes = Math.floor(seconds / 60);
        let startSeconds = seconds % 60;

        let endMinutes = startMinutes;
        let endSeconds = startSeconds + compressFactor;

        if (endSeconds > 60){
            endMinutes += 1;
            endSeconds = 0;
        }

        adjusted[`${startMinutes}:${fixSeconds(startSeconds)}-${endMinutes}:${fixSeconds(endSeconds)}`] = data[key];
    }

    return adjusted;

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

function fixSeconds(n: number): string{
    if (n < 10){
        return "0" + n;
    }

    return n + "";
}