require('dotenv').config();
const fetch = require('node-fetch');

const { AUTH_USERNAME, AUTH_PASSWORD } = process.env;
const AUTH_HEADER = `Basic ${Buffer.from(`${AUTH_USERNAME}:${AUTH_PASSWORD}`).toString('base64')}`;
const API_URL = `${process.env.API_URL}:${process.env.API_PORT}`;

const apiClient = {};

apiClient.department = {
    getAll: () => request('/department?size=999'),
};

apiClient.vacancy = {
    search: (numResults, pageNum, options) => {
        const reqOptions = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options),
        };
        return request(`/vacancy/search?size=${numResults}&page=${pageNum - 1}`, 'POST', reqOptions);
    },
    getById: id => request(`/vacancy/${id}`),
};

module.exports = apiClient;

// private functions
async function request(path = null, method = 'GET', requestOptions = {}) {
    const options = {
        ...requestOptions,
        method,
        headers: {
            'Authorization': AUTH_HEADER,
            ...requestOptions.headers,
        },
    };

    try {
        const res = await fetch(`${API_URL}${path}`, options).catch(err => err);
        return await res.json();
    } catch (e) {
        return e;
    }
}
