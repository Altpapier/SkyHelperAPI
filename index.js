//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const FetchurRoute = require('./routes/v1/fetchur');
const ProfileRoute = require('./routes/v1/profile');
const ProfilesRoute = require('./routes/v1/profiles');
const NotFound = require('./middleware/notfound')
const Auth = require('./middleware/auth');
const ErrorHandler = require('./middleware/errorhandler');
const express = require('express');
const app = express();
const refreshCollections = require('./data/refreshCollections')
const refreshPrices = require('./data/refreshPrices')
const checkForUpdate = require('./middleware/checkforupdate')
require('dotenv').config();
const port = process.env.PORT || 3000;

process.on('uncaughtException', error =>console.log(error))
process.on('unhandledRejection', error => console.log(error))

app.use(express.static(__dirname + '/public'));
app.use(Auth);
app.use(require('cors')());
app.use(express.json());

app.get('/v1/fetchur', FetchurRoute);
app.get('/v1/profile/:uuid/:profileid', ProfileRoute);
app.get('/v1/profiles/:uuid', ProfilesRoute);

app.use(NotFound);
app.use(ErrorHandler);

refreshCollections();
refreshPrices();
checkForUpdate();

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});