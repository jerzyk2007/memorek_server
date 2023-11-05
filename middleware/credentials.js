
// const allowedOrigins = require('../config/allowedOrigins');

// const credentials = (req, res, next) => {
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.header('Access-Control-Allow-Origin', origin);
//         res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//         res.header('Access-Control-Allow-Credentials', true);
//     }
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//         return res.status(200).json({});
//     }
//     next();
// };

// module.exports = credentials;

const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", true);
    }
    next();
};

module.exports = credentials;
