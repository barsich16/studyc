module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Користувач не авторизований');
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
    static TokenExpiredError() {
        return new ApiError(401, 'Термін дії токену вийшов');
    }
    static DataBaseError() {
        return new ApiError(500, 'Помилка при оновленні даних. Спробуйте ще раз');
    }
}

