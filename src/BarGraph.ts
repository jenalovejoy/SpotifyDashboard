/* Aggregates options for presenting data components */
type StringMap<T> = {[key: string]: T};

export interface BarGraphOptions {

    // Legend Preferences
    title: string;       // Graph title
    name: string;        // How divs will be labeled for this specific graph
    unit: string;

    xAxisLabel?: string;      // Label for x axis
    yAxisLabel?: string;      // Label for y axis

    // Display Pref
    color?: string[];

    // Dimensions
    width: number;       // Length of x axis in pixels
    height: number;      // Length of y axis in pixels
    
    // Data preferences
    /**
     * Sort preferences -> true for sorting by the value, false for sorting by the key
     */
    sortByValue: boolean;
    
    desc?: boolean; // true if data sorted descending, false if ascending 

    limit?: {   
        nLimit: number; // limit to a certain number
        percentLimit?: number; // limit to a certain percentage
    };

} 

export interface BarElement {

    label: string; 
    value: number;
    unit?: string;

    height: number;
    color?: string;
}

export class BarGraph {

    private options: BarGraphOptions;
    private name: string;
    private title: string;
    private colors: string[];
    private unit: string;
    private limit: number;
    private xAxisLabel: string;
    private yAxisLabel: string;
    private barGraphHeight: number;
    private barGraphWidth: number;
    private dataWidth: number;
    private maxBarHeight: number;
    private sortByValue: boolean;

    constructor(options: BarGraphOptions){
        this.options = options;
        this.name = options.name;
        this.title = options.title;
        this.colors = options.color;
        this.unit = options.unit;
        this.sortByValue = options.sortByValue;

        this.xAxisLabel = options.xAxisLabel;
        this.yAxisLabel = options.yAxisLabel;

        this.barGraphHeight = options.height;
        this.barGraphWidth = options.width;
        this.dataWidth = this.barGraphWidth - 20; // 10 px margins
        this.maxBarHeight = Math.floor(options.height * .75); // graph bars have a maximun height of 75% of the total componenet height
    }

    public render(container: string, data: StringMap<number>): void{

        const controlDiv = `<div class="barGraph" id="${this.name}BarGraph" style="width: ${this.barGraphWidth}px; height:${this.barGraphHeight}px; "> </div>`;
        const bodyDiv = `<div class="barGraphBody" id="${this.name}BarGraphBody"> </div>`;
        const barsDiv = `<div class="barGraphData" id="${this.name}Data"> </div>`;
        const titleDiv = `<div class="barGraphTitle" id="${this.name}Title">${this.title}</div>`;

        $(container).append(controlDiv);
        $(`#${this.name}BarGraph`).append(titleDiv);
        $(`#${this.name}BarGraph`).append(bodyDiv);
        

        if (this.yAxisLabel !== undefined){
            const yAxisDiv = `<div class="barGraph-yLabel" id="${this.name}YLabel">${this.yAxisLabel}</div>`;
            $(`#${this.name}BarGraphBody`).append(yAxisDiv);
        }

        $(`#${this.name}BarGraphBody`).append(barsDiv);

        let barGraphElements = this.sortElements(this.convertDataToBarElements(data, this.maxBarHeight), this.sortByValue);
        let itemCount = barGraphElements.length;

        if (this.options.limit !== undefined){
            const n = this.options.limit.nLimit;

            if (n < itemCount){
                barGraphElements = barGraphElements.slice(0, n-1);
                itemCount = barGraphElements.length;
            }
            
        }
        
        const colWidth = this.dataWidth/itemCount;
        let fontSize = colWidth / 2;

        if (fontSize > 18){
            fontSize = 18;
        }

        for (let i = 0; i < itemCount; i++){
            const element = barGraphElements[i];
            const label = element.label;
            const value = element.value;
            const height = element.height;

            const barDiv = `<div class="bar" title="${label} with ${value} ${this.unit}" style="height: ${height}px; background-color:${this.colors[i%this.colors.length]}">${value}</div>`;
            const labelDiv = `<div class="barGraph-label" id="${this.name}Label" title="${label}" style="width:${colWidth - 4}px; line-height:${colWidth - 4}px">${label}</div>`;
            const columnDiv = `<div class="barGraphColumn" id="${this.name}Column" style="width:${colWidth}px; font-size:${fontSize}px">${barDiv}${labelDiv}</div>`;
            $(`#${this.name}Data`).append(columnDiv);
        }


        if (this.xAxisLabel !== undefined){
            const xAxisDiv = `<div class="barGraph-xLabel" id="${this.name}XLabel">${this.xAxisLabel}</div>`;
            $(`#${this.name}BarGraph`).append(xAxisDiv);
        }

    }

    private convertDataToBarElements(data: StringMap<number>, maxBarHeight: number): BarElement[]{

        const maxCount = this.getMax(data);

        return Object.keys(data).map(key => 
            ({
                label: key, 
                value: data[key], 
                height: Math.floor((data[key] / maxCount) * maxBarHeight)
            }
            ));
    }

    private sortElements(data: BarElement[], sortValue: boolean): BarElement[]{
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

    private getMax(struct: StringMap<number>): number{

        let max = 0;
        for (const v in struct){
            if (struct[v] > max){
                max = struct[v];
            }
        }

        return max;

    }
}