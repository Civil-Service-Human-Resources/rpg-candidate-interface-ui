require('dotenv').config();
const fetch = require('node-fetch');

const { AUTH_USERNAME, AUTH_PASSWORD } = process.env;
const AUTH_HEADER = `Basic ${Buffer.from(`${AUTH_USERNAME}:${AUTH_PASSWORD}`).toString('base64')}`;

const apiClient = {};

apiClient.department = {
    getAll: (next = null) => request('/department?size=999', 'GET', {}, next),
};

apiClient.vacancy = {
    search: (numResults, pageNum, options, next) => {
        const reqOptions = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options),
        };

        return request(
            `/vacancy/search?size=${numResults}&page=${pageNum - 1}`,
            'POST',
            reqOptions,
            next,
        );
    },
    getById: (id, next) => request(`/vacancy/${id}`, 'GET', {}, next),
};

apiClient.health = {
    check: () => {
        const reqOptions = {
            timeout: 200,
        };
        return request('/department?size=999', reqOptions);
    },
};

module.exports = apiClient;

// private functions
async function request(path = null, method = 'GET', requestOptions = {}, next) {
    const options = {
        ...requestOptions,
        method,
        headers: {
            'Authorization': AUTH_HEADER,
            ...requestOptions.headers,
        },
    };

    try {
        return await fetch(`${process.env.API_URL}${path}`, options)
            .then(async (response) => {
                // if API returns a valid error response
                if (statusAnError(response.status)) {
                    throw {
                        status: response.status,
                        message: response.statusText,
                        url: response.url,
                        custom: true,
                    };
                }

                return response;
            })
            .then(data => data.json())
            .catch(error => next(error));
    } catch (error) {
        return next(error) || null;
    }
}

function statusAnError(status = 200) {
    return status.toString().startsWith('5') || status.toString().startsWith('4');
}
