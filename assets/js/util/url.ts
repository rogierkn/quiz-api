import {apiConfig} from "../env";

export default function url(path: string) {
    // Check if already has url query, if so split and add that back after adding format
        return apiConfig.url + path;
}