const Error = require('./error');

class DaoError extends Error {
    constructor(errorCode, message, query, values) {
        super(errorCode, message)
        this.query = query;
        this.values = values;
    }
}

module.exports = DaoError;