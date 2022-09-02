//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { makeRequest, wrap } = require('../../utils/request');
const { isUuid } = require('../../utils/uuid');
const getActiveAuctions = require('../../stats/auctions.js');

module.exports = wrap(async function (req, res) {
    let uuid = req.params.uuid;
    if (!isUuid(uuid)) {
        const mojang_response = await makeRequest(res, `https://api.ashcon.app/mojang/v2/user/${uuid}`);
        if (mojang_response?.data?.uuid) {
            uuid = mojang_response.data.uuid.replace(/-/g, '');
        }
    }

    const auctionsRes = (await makeRequest(res, `https://api.hypixel.net/skyblock/auction?key=${process.env.HYPIXEL_API_KEY}&player=${uuid}`)).data;

    const auctions = getActiveAuctions(auctionsRes)

    return res.status(200).json({ status: 200, data: auctions });
});
