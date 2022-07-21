const jwt = require('jsonwebtoken');
const ApiError = require('../exceptions/api-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]  // "Bearer TOKEN"
        if (!token) {
            throw ApiError.UnauthorizedError();
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        if (e.message === 'jwt expired') {
            throw ApiError.TokenExpiredError();
        }
        next(e)
    }
}
