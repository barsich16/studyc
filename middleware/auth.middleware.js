const jwt = require('jsonwebtoken');
//const config = require('config');
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
        // const cook = req.cookies.token;
        //console.log("Куки: ", cook );
        console.log("decoded: ", decoded);
        req.user = decoded;
        next();
    } catch (e) {
        next(e)
        //res.status(401).json({ JWTExpired: true, message: 'Термін дії токену вийшов'});
    }
}
