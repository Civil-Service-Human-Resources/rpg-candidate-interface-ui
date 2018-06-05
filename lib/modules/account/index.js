const apiClient = require('../apiClient');

const ACCOUNT_EXISTS = 'IM_USED';
const ACCOUNT_CREATED = 'SUCCESS';

const createUserAccount = async (user, next) => {
    const { fullname, email, password } = user;

    const response = await apiClient.account.create(fullname, email, password, next);

    return response.status === ACCOUNT_EXISTS ? {
        error: true,
        status: ACCOUNT_EXISTS,
    } : {
        error: false,
        status: ACCOUNT_CREATED,
        username: response.id,
    };
};

module.exports = {
    createUserAccount,
    ACCOUNT_EXISTS,
    ACCOUNT_CREATED,
};
