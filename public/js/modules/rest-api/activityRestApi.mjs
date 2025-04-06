const baseUrl = '/api/activity';

const getAllActivities = async () => {
    const response = await fetch(`${baseUrl}/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

const getActivityById = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

const getActivitiesByType = async (type) => {
    const response = await fetch(`${baseUrl}/type/${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

const getActivityByName = async (name) => {
    const response = await fetch(`${baseUrl}/name/${name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export {
    getAllActivities,
    getActivityById,
    getActivitiesByType,
    getActivityByName,
};