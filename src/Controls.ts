import {Options} from "./Options"
import {BarElement} from "./BarElement"

type StringMap<T> = {[key: string]: T};

export function makeBarGraph(container:string, data:StringMap<number>, options:Options){

    let name = options["name"];
    let title = options["title"];
    let colors = options["color"];
    let doLimit = options["limit"];

    let width = options["width"];
    let maxBarHeight = Math.floor(options["height"] * .75)

    let controlDiv = `<div class=\"barGraph\" id=\"${name}BarGraph\"> </div>`;
    let barsDiv = `<div class=\"barGraphData\" id=\"${name}Data\"> </div>`;
    let titleDiv = `<div class=\"barGraphTitle\" id=\"${name}Title\">${title}</div>`;

    $(container).append(controlDiv);
    $(`#${name}BarGraph`).append(titleDiv);
    $(`#${name}BarGraph`).append(barsDiv);
    
    let barGraphElements = sortElements(convertDataToElements(data, maxBarHeight), options["sortValue"]);
    let itemCount = barGraphElements.length;

    // if (doLimit){
    //     let limit = options["nLimit"];

    //     if (limit < itemCount){
    //         barGraphElements = barGraphElements.slice(0, limit-1);
    //     }
        
    // }
    
    let colWidth = width/itemCount;
    let unit = options["unit"];

    for (let i = 0; i < itemCount; i++){

        let element = barGraphElements[i];
        let label = element["label"];
        let value = element["value"];
        let height = element["height"];

        let barDiv = `<div class="bar" title="${label} with ${value} ${unit}" style=\"height: ${height}px; background-color:${colors[i%colors.length]}\"></div>`;
        let labelDiv = `<div class="label" title="${label}">${label}</div>`;
        let columnDiv = `<div class=\"barGraphColumn\" id=\"${name}Column\" style="width:${colWidth}px">${barDiv}${labelDiv}</div>`;
        $(`#${name}Data`).append(columnDiv);

    }
}

export function convertDataToElements(data:StringMap<number>, maxBarHeight:number):BarElement[]{

    let dataElements = [];

    let maxCount = getMax(data);

    for (let key in data){
        let count = data[key];
        let height = Math.floor((count / maxCount)* maxBarHeight); 

        let barItem = {"label": `${key}`, "value": `${count}`, "height": `${height}`};

        dataElements.push(barItem);
    }
    
    return dataElements;
}

function sortElements(data:BarElement[], sortValue:boolean){
    if (sortValue){
        data.sort((a, b) => {
            if (a["key"] > b["key"]){
                return 1;
            } else if (a["key"] < b["key"]){
                return -1;
            }
            return 0;
        });
    } else {
        data.sort((a, b) => {
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

function getMax(struct:StringMap<number>){

    let max = 0;
    for (let v in struct){
        if (struct[v] > max){
            max = struct[v];
        }
    }

    return max;
}