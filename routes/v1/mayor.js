//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { isUuid } = require('../../utils/uuid');
const { makeRequest, wrap } = require('../../utils/request');
const { parseMayorData } = require('../../utils/hypixel');

module.exports = wrap(async function (req, res) {
    const mayorRes = await makeRequest(res, `https://api.hypixel.net/resources/skyblock/election`);

    const mayorData = await parseMayorData(mayorRes.data);

    return res.status(200).json({ status: 200, data: mayorData });
});
