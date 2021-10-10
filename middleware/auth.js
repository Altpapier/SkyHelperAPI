const { isUuid } = require('../utils/uuid')

module.exports = (req, res, next) => {
    if (req.headers.hasOwnProperty('authorization') && isUuid(req.headers.authorization)) {
        req.authToken = req.headers.authorization

        return next()
    }

    if (req.query.hasOwnProperty('key') && isUuid(req.query.key?.toString())) {
        req.authToken = req.query.key?.toString()

        return next()
    }

    return res.status(400).json({
        status: 400,
        reason: 'Missing "key" query parameter, or an "authorization" header with a valid Hypixel API token',
    })
}