/* Given an array of numerical data, calculates basic statistics */

// Object for aggregating statistical data
export interface StatsSummary {
    "Mean": number;
    "Median": number;
    "Standard Deviation": number;
}

// Calculates the mean of all data samples
export function mean(data: number[]): number {
    let length = data.length;
    let sum = 0;

    for (let d of data){
        sum = sum + d;
    }

    return (sum/length);
}

// Calculates variance of all data samples
function variance(data: number[]): number {
    let dataMean = mean(data);
    let length = data.length;

    let sqDiff = 0;     // squared difference
    let sumSqDiff = 0;  // sum of squared differences

    for (let d in data){
        let difference = parseInt(d) - dataMean;
        sqDiff = difference ** 2;
        sumSqDiff += sqDiff;
    }

    return sumSqDiff / length; // mean sum of squared differences
}

// Finds the median value of the dataset
export function median(data: number[]): number {

    // Sort data ascending
    data.sort((a, b): number => {
        if (a < b){
            return 1;
        } else if (a > b){
            return -1;
        }
        return 0;
    });

    let length = data.length;

    // Manage limited data cases
    if (length == 0){
        return 0;

    } else if (length == 1){
        return data[0];
    }

    // Pick the middle value, or the average of the two middle values (in an even-length data set)
    let i = Math.floor(length / 2);

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
export function getAll(data: number[]): StatsSummary {

    return {
        "Mean": mean(data),
        "Median": median(data),
        "Standard Deviation": stdDev(data)       
    };

}