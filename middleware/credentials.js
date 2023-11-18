
// const credentials = (req, res, next) => {
//     const origin = req.headers.origin;

//     if (origin === allowedOrigins) {
//         // if (origin === "https://server.memorek-online.pl") {
//         res.header("Access-Control-Allow-Credentials", true);
//     }

//     next();
// };

// module.exports = credentials;

// const credentials = (req, res, next) => {
//     const origin = req.headers.origin;
//     if (process.env.ALLOWED_ORIGINS.includes(origin)) {
//         res.header("Access-Control-Allow-Credentials", true);
//     }
//     next();
// };

// module.exports = credentials;

const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
};

module.exports = credentials;