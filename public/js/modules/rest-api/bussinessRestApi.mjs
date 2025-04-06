const baseURL = "/api/business";

const getAllBussiness = async () => {
    return fetch(`${baseURL}/all`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    });
};

const getBussinessById = async (id) => {
    return fetch(`${baseURL}/${id}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    });
};

const getAllBussinessByType = async (type) => {
    return fetch(`${baseURL}/all/${type}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    });
};

const modifyBussiness = async (id, data) => {
    return fetch(`${baseURL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
        credentials: "include",
    });
};

export { getAllBussiness, getBussinessById, modifyBussiness, getAllBussinessByType };


