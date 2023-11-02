require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;



// Handle options credentials check - before cors
// and fetch cookies credentials requirement
app.use(credentials);





// Cross Origin Resource Sharing
// app.use(cors(corsOptions));
app.use(
    cors({
        origin: "https://front-web.pl",
        credentials: true,
    })
);

// cookie problemm on Heroku
app.set('trust proxy', 1);


// built-in middleware to handle urlencoded data
// in other words, form data
// 'content-type:application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: false }));


// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// server static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
// app.use('/', require('./routes/root'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// app.use(verifyJWT);
app.use('/phrases', require('./routes/api/phrases'));
app.use('/collections', require('./routes/api/collections'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
}
);

// connect to mongoDB
connectDB();

mongoose.connection.once('open', () => {
    console.log('Connected to mongoDB');
    app.listen(PORT, () => {
        console.log(`Server is listenig on port ${PORT}`);
    });
});
