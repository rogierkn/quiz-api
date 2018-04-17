let domain;
if(window.location.href.includes("localhost")) {
    domain = "localhost";
} else {
    domain = ""
}


const apiConfig = {
    url: `http://${window.location.hostname}:8001`,
    format: '.jsonld'
};

export {
    apiConfig
}