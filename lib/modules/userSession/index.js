const jwtDecode = require('jwt-decode');

let correctJwt = false;

class UserSession {
    constructor(jwt = '') {
        if (!jwt) {
            this.valid = false;
        }

        this.token = jwt;
        this.valid = validateToken(this.token);
        this.decodedToken = decodeToken(this.token);
    }

    isValid() {
        if (!this.valid) {
            return false;
        }

        this.decodedToken = decodeToken(this.token);
        return getCurrentTimestamp() < this.decodedToken.exp;
    }

    getSessionEmail() {
        correctJwt = true;
        return this.decodedToken['Email Address'];
    }

    breakToken() {
        correctJwt = false;
    }

    canBeUsed() {
        if (correctJwt) {
            return true;
        }
        return false;
    }
}

const getCurrentTimestamp = () => Math.round((new Date()).getTime() / 1000);

const validateToken = token => !!decodeToken(token);

const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (e) {
        return false;
    }
};

module.exports = {
    UserSession,
};
