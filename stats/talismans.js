const { decodeData } = require('../utils/nbt');
const { capitalize } = require('../constants/functions');
const { talismans: allTalismans } = require('../constants/talismans');

module.exports = async (profile) => {
    if (profile.talisman_bag?.data) {
        const talismans = {
            talismanBagUpgrades: profile?.accessory_bag_storage?.bag_upgrades_purchased,
            currentReforge: profile?.accessory_bag_storage?.selected_power,
            unlockedReforges: profile?.accessory_bag_storage?.unlocked_powers,
            tuningsSlots: profile?.accessory_bag_storage?.tuning?.highest_unlocked_slot,
            tunings: profile?.accessory_bag_storage?.tuning,
            common: [],
            uncommon: [],
            rare: [],
            epic: [],
            legendary: [],
            mythic: [],
            special: [],
            very: [],
        };
        delete(talismans.tunings.highest_unlocked_slot)
        const talisman_bag = (await decodeData(Buffer.from(profile.talisman_bag.data, 'base64'))).i;

        for (const talisman of talisman_bag) {
            if (talisman.tag?.display.Name && talisman.tag?.ExtraAttributes) {
                let name = talisman.tag?.display.Name.replace(/\u00A7[0-9A-FK-OR]/gi, '') || null;
                const reforge = capitalize(talisman.tag?.ExtraAttributes.modifier || null);
                if (reforge) name = name.substring(name.indexOf(' ') + 1);
                const isRecombed = talisman.tag?.ExtraAttributes.rarity_upgrades > 0 ? true : false || false;
                let new_talisman = {}

                if (getRarity(talisman.tag?.display.Lore) != 'common' && getRarity(talisman.tag?.display.Lore) != 'uncommon' && getRarity(talisman.tag?.display.Lore) != 'rare' && getRarity(talisman.tag?.display.Lore) != 'epic') {
                    new_talisman = {
                        name: allTalismans[talisman.tag?.ExtraAttributes.id]?.name || name,
                        id: talisman.tag?.ExtraAttributes.id || null,
                        reforge: reforge ?? 'None',
                        rarity: getRarity(talisman.tag?.display.Lore).toUpperCase(),
                        recombobulated: isRecombed,
                        enrichment: talisman.tag?.ExtraAttributes?.talisman_enrichment ?? 'None'
                    };
                } else {
                    new_talisman = {
                        name: allTalismans[talisman.tag?.ExtraAttributes.id]?.name || name,
                        id: talisman.tag?.ExtraAttributes.id || null,
                        reforge: reforge ?? 'None',
                        rarity: getRarity(talisman.tag?.display.Lore).toUpperCase(),
                        recombobulated: isRecombed,
                    };
                }
                if (talismans[getRarity(talisman.tag?.display.Lore)]) talismans[getRarity(talisman.tag?.display.Lore)].push(new_talisman);
                else talismans[getRarity(talisman.tag?.display.Lore)] = new_talisman;
            }
        }
        console.log(talismans)
        return talismans;
    } else {
        return {
            common: [],
            uncommon: [],
            rare: [],
            epic: [],
            legendary: [],
            mythic: [],
        };
    }
};

function getRarity(lore) {
    let last_index = lore[lore.length - 1];
    last_index = last_index.replace(/\u00A7[0-9A-FK-OR]/gi, '').toLowerCase();
    if (last_index.startsWith('a ')) last_index = last_index.substring(2);
    last_index = last_index.substring(0, last_index.indexOf(' '));
    return last_index;
}
