export interface StatsSummary {
    // n: number;
    "Mean": number;
    "Median": number;
    "Standard Deviation": number;
}

export function mean(data: number[]): number {
    let length = data.length;
    let sum = 0;

    for (let d of data){
        sum = sum + d;
        console.log(d);
        console.log(sum);
    }

    

    let mean = sum/length;

    console.log(mean);

    return mean;
}

function variance(data: number[]): number {
    let dataMean = mean(data);
    let length = data.length;

    let sqDiff = 0;
    let sumSqDiff = 0;

    for (let d in data){
        let difference = parseInt(d) - dataMean;
        sqDiff = difference ** 2;
        sumSqDiff += sqDiff;
    }
    return sumSqDiff / length;
}

export function median(data: number[]): number {

    data.sort((a, b): number => {
        if (a < b){
            return 1;
        } else if (a > b){
            return -1;
        }
        return 0;
    });

    let length = data.length;

    if (length == 0){
        return 0;

    } else if (length == 1){
        return data[0];
    }

    let i = Math.floor(length / 2);

    if (length % 2 == 1){
        return data[i];
    }

    return (data[i-1] + data[i]) / 2;
}

export function stdDev(data: number[]): number{
    return variance(data) ** (1/2);
}

export function getAll(data: number[]): StatsSummary {

    return {
        // n: data.length,
        "Mean": mean(data),
        "Median": median(data),
        "Standard Deviation": stdDev(data)       
    };

}