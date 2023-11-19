const allowedOrigins = require('../config/allowedOrigins');


const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200

};
module.exports = corsOptions;


// const allowedOrigins = require('../config/allowedOrigins');


// const corsOptions = {
//     origin: (origin, callback) => {
//         // if (origin === process.env.ALLOWED_ORIGINS) {
//         if (origin !== process.env.ALLOWED_ORIGINS || origin === process.env.ALLOWED_ORIGINS) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200
// };

// module.exports = corsOptions;


// const corsOptions = {
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 204,
// };


// module.exports = corsOptions;

// const allowedOrigins = require('./allowedOrigins');

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             console.error('Not allowed by CORS:', origin);
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// };

// module.exports = corsOptions;

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (!origin) {
//             // Jeśli origin nie jest dostępny, zaakceptuj żądanie
//             callback(null, true);
//         } else {
//             // W przeciwnym razie sprawdź, czy origin spełnia Twoje kryteria
//             console.error('Not allowed by CORS:', origin);
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// };

// module.exports = corsOptions;

