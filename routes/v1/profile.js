const { isUuid } = require('../../utils/uuid');
const { makeRequest } = require('../../utils/request')
const { parseHypixel, parseProfile } = require('../../utils/hypixel')

module.exports = async (req, res) => {
    const profileid = req.params.profileid;
    let uuid = req.params.uuid;
    if (!isUuid(uuid)) {
        const mojang_response = await makeRequest(res, `https://api.mojang.com/users/profiles/minecraft/${uuid}`)
        if (mojang_response.data.id) {
            uuid = mojang_response.data.id
        }
    }

    const playerRes = await makeRequest(res, `https://api.hypixel.net/player?key=${req.authToken}&uuid=${uuid}`);
    const player = parseHypixel(playerRes, uuid, res);
    if (!player) return;

    const profileRes = await makeRequest(res, `https://api.hypixel.net/skyblock/profiles?key=${req.authToken}&uuid=${uuid}`);
    const profile = await parseProfile(player, profileRes, uuid, profileid, res);
    if (!profile) return;


    return res.status(200).json(profile);
}