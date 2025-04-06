const baseUrl = '/api/activity';

const getAllActivities = async () => {
    return await fetch(`${baseUrl}/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const getActivityById = async (id) => {
    return await fetch(`${baseUrl}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const getActivitiesByType = async (type) => {
    return await fetch(`${baseUrl}/type/${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const getActivityByName = async (name) => {
    return await fetch(`${baseUrl}/name/${name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export {
    getAllActivities,
    getActivityById,
    getActivitiesByType,
    getActivityByName,
};