//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { isUuid } = require('../../utils/uuid');
const { makeRequest, wrap } = require('../../utils/request');
const { parseBingoProfile } = require('../../utils/hypixel');

module.exports = wrap(async function (req, res) {
    let uuid = req.params.uuid;
    if (!isUuid(uuid)) {
        const mojang_response = await makeRequest(res, `https://api.ashcon.app/mojang/v2/user/${uuid}`);
        if (mojang_response?.data?.uuid) {
            uuid = mojang_response.data.uuid.replace(/-/g, '');
        }
    }

    const profileRes = await makeRequest(res, `https://api.hypixel.net/skyblock/bingo?key=${process.env.HYPIXEL_API_KEY}&uuid=${uuid}`);
    const bingoRes = await makeRequest(res, `https://api.hypixel.net/resources/skyblock/bingo`);

    if (bingoRes.data.id !== profileRes.data.events[profileRes.data.events.length-1].key) return res.status(200).json({status: 200, data: `Found no Bingo profiles for a user with a UUID of '${uuid}'` })
    
    const profile = parseBingoProfile(profileRes, bingoRes, uuid);

    return res.status(200).json({ status: 200, data: profile });
});
