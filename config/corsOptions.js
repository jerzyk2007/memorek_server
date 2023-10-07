const allowedOrigin = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        // work on other servers than localhost
        // if (whiteList.indexOf(origin) !== -1) {
        if (!origin || allowedOrigin.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;