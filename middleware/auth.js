require('dotenv').config();
const axios = require('axios');

let urlAuthTokens;
if (process.env.AUTH_TOKEN_URL) {
    setTokens();
    setInterval(() => setTokens(), 1000 * 60 * 5); // 5 minutes

    async function setTokens() {
        urlAuthTokens = (await axios.get(process.env.AUTH_TOKEN_URL)).data;
    }
}

//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
module.exports = (req, res, next) => {
    const AuthTokens = urlAuthTokens || process.env?.TOKENS?.split(',') || [];

    if (req.headers.hasOwnProperty('authorization') && AuthTokens.includes(req.headers.authorization)) {
        req.authToken = req.headers.authorization;

        return next();
    }

    if (req.query.hasOwnProperty('key') && AuthTokens.includes(req.query.key?.toString())) {
        req.authToken = req.query.key?.toString();

        return next();
    }

    return res.status(400).json({
        status: 400,
        reason: 'Missing "key" query parameter, or an "authorization" header with a valid SkyHelper API key',
    });
};