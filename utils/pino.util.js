import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';
import { ENV } from '../configs/constant.js';
import { createStream } from 'rotating-file-stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const createRotatingStream = (filename) => {
    return createStream(filename, {
        interval: '15d',  // Rotate every 15 days
        path: logsDir,    // Logs directory
        compress: 'gzip'  // Compress old files
    });
};

const timestampFormat = (timestamp) => {
    return format(new Date(timestamp), "MMMM dd yyyy, HH:mm:ss");
};

const createLogger = (filename) => {
    const stream = createRotatingStream(filename);
    const logger = pino({
        timestamp: () => `,"time":"${timestampFormat(Date.now())}"`,
        formatters: {
            level: (label) => ({ level: label }),
            bindings: (bindings) => ({ pid: bindings.pid, hostname: bindings.hostname }),
            log: (object) => object
          }
        
    }, stream);

    return logger;
};

const errorLogger = createLogger("pinoerrors.log");
export  { errorLogger };
