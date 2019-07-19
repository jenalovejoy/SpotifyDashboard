import {Options} from "./Options"
import {BarElement} from "./BarElement"

type StringMap<T> = {[key: string]: T};

export function makeBarGraph(container: string, data: StringMap<number>, options: Options): void{

    let name = options["name"];
    let title = options["title"];
    let colors = options["color"];

    let limit = options["limit"];

    let xAxisLabel = options["xAxis"];
    let yAxisLabel = options["yAxis"];

    let barGraphHeight = options["height"];
    let barGraphWidth = options["width"];
    let dataWidth = barGraphWidth * .9;
    let maxBarHeight = Math.floor(options["height"] * .75);

    let controlDiv = `<div class="barGraph" id="${name}BarGraph" style="width: ${barGraphWidth}px; height:${barGraphHeight}px; "> </div>`;
    let bodyDiv = `<div class="barGraphBody" id="${name}BarGraphBody"> </div>`;
    let barsDiv = `<div class="barGraphData" id="${name}Data"> </div>`;
    let titleDiv = `<div class="barGraphTitle" id="${name}Title">${title}</div>`;

    $(container).append(controlDiv);
    $(`#${name}BarGraph`).append(titleDiv);
    $(`#${name}BarGraph`).append(bodyDiv);
    

    if (yAxisLabel !== undefined){
        let yAxisDiv = `<div class="yLabel" id="${name}YLabel">${yAxisLabel}</div>`;
        $(`#${name}BarGraphBody`).append(yAxisDiv);
    }

    $(`#${name}BarGraphBody`).append(barsDiv);

    let barGraphElements = sortElements(convertDataToElements(data, maxBarHeight), options["sortValue"]);
    let itemCount = barGraphElements.length;

    if (limit !== undefined){
        let n = limit.nLimit;

        if (n < itemCount){
            barGraphElements = barGraphElements.slice(0, n-1);
            itemCount = barGraphElements.length;
        }
        
    }
    
    let colWidth = dataWidth/itemCount;
    let unit = options["unit"];

    for (let i = 0; i < itemCount; i++){
        let element = barGraphElements[i];
        let label = element.label;
        let value = element["value"];
        let height = element["height"];

        let barDiv = `<div class="bar" title="${label} with ${value} ${unit}" style=\"height: ${height}px; background-color:${colors[i%colors.length]}\">${value}</div>`;
        let labelDiv = `<div class="label" id="${name}Label" title="${label}">${label}</div>`;
        let columnDiv = `<div class="barGraphColumn" id="${name}Column" style="width:${colWidth}px">${barDiv}${labelDiv}</div>`;
        $(`#${name}Data`).append(columnDiv);
    }

    if (xAxisLabel !== undefined){
        let xAxisDiv = `<div class="xLabel" id="${name}XLabel">${xAxisLabel}</div>`;
        $(`#${name}BarGraph`).append(xAxisDiv);
    }

    
}

export function convertDataToElements(data: StringMap<number>, maxBarHeight: number): BarElement[]{

    let dataElements = [];

    let maxCount = getMax(data);

    for (let key in data){
        let count = data[key];
        let height = Math.floor((count / maxCount)* maxBarHeight); 

        let barItem: BarElement = {"label": key, "value": count, "height": height};
        dataElements.push(barItem);
    }
    
    return dataElements;
}

function sortElements(data: BarElement[], sortValue: boolean): BarElement[]{
    if (sortValue){
        data.sort((a, b): number => {
            if (a["value"] < b["value"]){
                return 1;
            } else if (a["value"] > b["value"]){
                return -1;
            }
            return 0;
        });
    } else {
        data.sort((a, b): number => {
            if (a["label"] > b["label"]){
                return 1;
            } else if (a["label"] < b["label"]){
                return -1;
            } 
            return 0;
        });
    }
    return data;
}

function getMax(struct: StringMap<number>): number{

    let max = 0;
    for (let v in struct){
        if (struct[v] > max){
            max = struct[v];
        }
    }

    return max;
}