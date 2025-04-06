const baseURL = "/api/trail";

const getAllTrails = async () => {
    return fetch(`${baseURL}/all`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    });
};

const getTrailById = async (id) => {
    return fetch(`${baseURL}/${id}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    });
};

const getTrailByTags = async (tags) => {
    return fetch(`${baseURL}/tags?tags=${tags}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    });
};

export { getAllTrails, getTrailById, getTrailByTags };


