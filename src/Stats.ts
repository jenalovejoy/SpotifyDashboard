/* Given an array of numerical data, calculates basic statistics */

export interface NumberDatum {
    label: string;
    data: number;
}

// Object for aggregating statistical data
export interface BasicStatsSummary {
    mean: NumberDatum;
    median: NumberDatum;
    stDev: NumberDatum;
}

// Calculates the mean of all data samples
export function mean(data: number[]): number {
    const length = data.length;
    let sum = 0;

    for (const d of data){
        sum = sum + d;
    }

    return (sum/length);
}

// Calculates variance of all data samples
function variance(data: number[]): number {
    const dataMean = mean(data);
    const length = data.length;

    let sqDiff = 0;     // squared difference
    let sumSqDiff = 0;  // sum of squared differences

    for (const d of data){
        const difference = d - dataMean;
        sqDiff = difference ** 2;
        sumSqDiff += sqDiff;
    }

    return sumSqDiff / length; // mean sum of squared differences
}

// Finds the median value of the dataset
export function median(data: number[]): number {

    // Sort data ascending
    data.sort();

    const length = data.length;

    // Manage limited data cases
    if (length == 0){
        return 0;

    } else if (length == 1){
        return data[0];
    }

    // Pick the middle value, or the average of the two middle values (in an even-length data set)
    const i = Math.floor(length / 2);

    if (length % 2 == 1){
        return data[i];
    }

    return (data[i-1] + data[i]) / 2;
}

// Calculates standard deviation as the square root of variance
export function stdDev(data: number[]): number{
    return variance(data) ** (1/2);
}

// Returns all statistics in one object
export function getAll(data: number[]): BasicStatsSummary {

    return {
        mean: {
            label: "Mean",
            data: parseInt(mean(data).toFixed(2))
        },
        median: {
            label: "Median",
            data: parseInt(median(data).toFixed(2))
        },
        stDev: {
            label:"Standard Deviation",
            data: parseInt(stdDev(data).toFixed(2))
        }
    };

}