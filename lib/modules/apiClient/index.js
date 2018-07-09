require('dotenv').config();
const fetch = require('node-fetch');
const contextService = require('request-context');

const {
    AUTH_USERNAME,
    AUTH_PASSWORD,
    API_SEARCH_URL,
    API_ACCOUNT_URL,
} = process.env;

const AUTH_HEADER = `Basic ${Buffer.from(`${AUTH_USERNAME}:${AUTH_PASSWORD}`).toString('base64')}`;

const apiClient = {};

apiClient.department = {
    getAll: (next = null) => request(API_SEARCH_URL, '/department?size=999', 'GET', {}, next),
};

apiClient.vacancy = {
    search: (numResults, pageNum, options, next) => {
        const reqOptions = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options),
        };

        return request(
            API_SEARCH_URL,
            `/vacancy/search?size=${numResults}&page=${pageNum - 1}`,
            'POST',
            reqOptions,
            next,
        );
    },
    getById: (id, next) => request(API_SEARCH_URL, `/vacancy/${id}`, 'GET', {}, next),
};

apiClient.account = {
    create: (fullName, email, password, next) => {
        const reqOptions = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: fullName,
                emailAddress: email,
                password,
            }),
        };

        return request(API_ACCOUNT_URL, '/useraccount/create', 'POST', reqOptions, next);
    },
};

apiClient.internalJobs = {
    authorize: (email, next) => {
        const reqOptions = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailAddress: email,
            }),
        };

        return request(API_SEARCH_URL, '/vacancy/verifyemail', 'POST', reqOptions, next);
    },
};

apiClient.health = {
    check: () => {
        const reqOptions = {
            timeout: 200,
        };
        return request(API_SEARCH_URL, '/department?size=999', reqOptions);
    },
};

// private functions
async function request(url, path = null, method = 'GET', requestOptions = {}, next) {
    const jwt = contextService.get('request:jwt');
    const options = {
        ...requestOptions,
        method,
        headers: {
            Authorization: AUTH_HEADER,
            ...requestOptions.headers,
        },
    };

    if (jwt) {
        options.headers['cshr-authentication'] = jwt;
    }

    try {
        return await fetch(`${url}${path}`, options)
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
            .then(data =>
                (data.status === 204 ? true : data.json()))
            .catch(error =>
                next(error.status
                    ? error
                    : {
                        status: 500,
                        message: error,
                        url: null,
                        custom: true,
                    }));
    } catch (error) {
        return next(error) || null;
    }
}

function statusAnError(status = 200) {
    return status.toString().startsWith('5') || status.toString().startsWith('4');
}

module.exports = apiClient;
