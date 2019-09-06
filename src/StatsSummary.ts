import { BarGraphOptions } from "./BarGraph";
import * as Stats from "./Stats";

export interface StatsSummaryOptions {

    // Legend Preferences
    title: string;       // Graph title
    name: string;        // How divs will be labeled for this specific graph
    unit: string;

    // Dimensions
    width: number;       // Length of x axis in pixels
    height: number;      // Length of y axis in pixels

} 

export function render(container: string, data: number[], options: StatsSummaryOptions): void{

    const summaryItems: Stats.BasicStatsSummary = Stats.getAll(data);

    const title = options.title;
    const name = options.name;

    const summaryHeight = options.height;
    const summaryWidth = options.width;

    const controlDiv = `<div class="statsSummary" id="${name}StatsSummary" style="width: ${summaryWidth}px; height:${summaryHeight}px;"> </div>`;
    const titleDiv = `<div class="statsTitle" id="${name}Title">${title}</div>`
    const bodyDiv = `#${name}StatsSummary`;

    $(container).append(controlDiv);
    $(bodyDiv).append(titleDiv);

    for (const stat in summaryItems){
        const labelDiv = `<div class="statsLabel" id="${name}Label">${summaryItems[stat].label}</div>`;
        const valueDiv = `<div class="statsValue" id="${name}Value">${summaryItems[stat].data}</div>`;
        const wrapperDiv = `<div class="statsRow" id="${name}Row">${labelDiv}${valueDiv}</div>`;
        $(bodyDiv).append(wrapperDiv);

    }
} 

