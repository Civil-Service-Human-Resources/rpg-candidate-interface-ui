const apiClient = require('../apiClient');

const authenticateInternalOpsRequest = async (email, department, next) => {
    const response = await apiClient.internalJobs.authorize(email, department, next);

    return response;
};

module.exports = {
    authenticateInternalOpsRequest,
};
