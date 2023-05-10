import store from '../redux/store';
var urljoin = require('url-join');

const state = store.getState();
let envArguments = state.tornjak.globalEnvArguments;

// API_SERVER_URL
let ApiServerUri = process.env["REACT_APP_API_SERVER_URI"];

export default function GetApiServerUri(uri: string): string {
    console.log("envArguments.REACT_APP_API_SERVER_URI", envArguments.REACT_APP_API_SERVER_URI)
    ApiServerUri = envArguments.REACT_APP_API_SERVER_URI;
    return urljoin(ApiServerUri ? ApiServerUri : "/", uri)
}

// const IS_DUBUG = process.env["REACT_APP_DEBUG_TORNJAK"] || window.DEBUG_TORNJAK;
// console.log(process.env["REACT_APP_DEBUG_TORNJAK"]);
// console.log(window.DEBUG_TORNJAK);

export const logDebug = function (...args: any[]) {
    if (process.env["REACT_APP_DEBUG_TORNJAK"]) { // real time variable
        console.log(...args);
    }
};

export const logError = function (...args: any[]) {
    if (process.env["REACT_APP_DEBUG_TORNJAK"]) { // real time variable
        console.error(...args);
    }
};

export const logWarn = function (...args: any[]) {
    if (process.env["REACT_APP_DEBUG_TORNJAK"]) { // real time variable
        console.warn(...args);
    }
};


// IS_MANAGER

