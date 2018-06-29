const apiClient = require('../apiClient');

const authenticateInternalOpsRequest = async (email, next) => {
    const response = await apiClient.internalJobs.authorize(email, next);

    return response;
};

module.exports = {
    authenticateInternalOpsRequest,
};
