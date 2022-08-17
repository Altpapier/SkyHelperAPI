//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)

const { wrap } = require('../../utils/request');
const { buildSkyblockCalendar } = require('../../constants/calendar');

module.exports = wrap(async function (req, res) {
    const calendar = buildSkyblockCalendar(null, Date.now(), (Date.now()+10710000000), 1, true)

    return res.status(200).json({ status: 200, data: calendar });
});
