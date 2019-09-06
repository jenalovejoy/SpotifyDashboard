export interface SpotifyList<T> {

    /** 
     *   Link to current query results
    */
    href: string;

    items: T[];

    // Paging information
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;

}