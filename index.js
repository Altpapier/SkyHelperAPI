//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const FetchurRoute = require('./routes/v1/fetchur');
const bingoRoute = require('./routes/v1/bingo');
const calendarRoute = require('./routes/v1/calendar.js')
const ProfileRoute = require('./routes/v1/profile');
const ProfilesRoute = require('./routes/v1/profiles');
const ProfileItemsRoute= require('./routes/v1/profileItems')
const ProfilesItemsRoute = require('./routes/v1/profilesItems')
const NotFound = require('./middleware/notfound');
const Auth = require('./middleware/auth');
const ErrorHandler = require('./middleware/errorhandler');
const rateLimit = require('express-rate-limit');
const express = require('express');
const app = express();
const refreshCollections = require('./data/refreshCollections');
const refreshPrices = require('./data/refreshPrices');
const checkForUpdate = require('./middleware/checkforupdate');
require('dotenv').config();
const port = process.env.PORT || 3000;

process.on('uncaughtException', (error) => console.log(error));
process.on('unhandledRejection', (error) => console.log(error));

const limiter = rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many requests, please try again later.',
    },
});

app.use(express.static(__dirname + '/public')); 
app.use(limiter);
app.use(Auth);
app.use(require('cors')());
app.use(express.json());

app.get('/v1/fetchur', FetchurRoute);
app.get('/v1/profile/:uuid/:profileid', ProfileRoute);
app.get('/v1/profiles/:uuid', ProfilesRoute);
app.get('/v1/items/:uuid/:profileid', ProfileItemsRoute);
app.get('/v1/items/:uuid', ProfilesItemsRoute);
app.get('/v1/bingo/:uuid', bingoRoute)
app.get('/v1/calendar', calendarRoute)

app.use(NotFound);
app.use(ErrorHandler);

refreshCollections();
refreshPrices();
checkForUpdate();

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
