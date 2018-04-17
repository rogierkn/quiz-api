/**
 * Generates a valid url for a given route with given parameters
 * @param {string} route
 * @param params
 * @returns {string}
 */
export default function route(route: string, params: any): string {
    for(const param in params) {
        if(!params.hasOwnProperty(param)) continue;
        route = route.replace(":" + param, params[param]);
    }
    return route;
};