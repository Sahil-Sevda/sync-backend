import fs from "fs";

const errorHandler = (error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || 'Internal Server Error';

    const errorLogStream = fs.createWriteStream('./logs/error.log', { flags: 'a' });
    const log = `[${new Date().toISOString()}] ${500} - ${message} - ${req.originalUrl} - ${req.method}`;
	errorLogStream.write(log + '\n');

    const response = {
        success: false,
        message: message,
        data: []
    };

    res.status(statusCode).send(response);
};

export default errorHandler;
