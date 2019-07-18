
export interface Options {

    // Legend Preferences
    title:string;       // Graph title
    name:string;        // How divs will be labeled for this specific graph
    unit:string;
    xAxis?:string;      // Label for x axis
    yAxis?:string;      // Label for y axis

    // Display Pref
    color?:string[];

    // Dimensions
    width:number;       // Length of x axis in pixels
    height:number;      // Length of y axis in pixels

    // Data preferences
    sortValue:boolean;
    limit:boolean;
    nLimit?:number; // limit to a certain number
    pLimit?:number; // limit to a certain percentage
    desc?:boolean; // true if data sorted descending, false if ascending 

}