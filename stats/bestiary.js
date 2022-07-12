const { bestiary, bestiaryKills } = require('../constants/bestiary.js');

module.exports = (profile) => {
    const result = {
        level: 0,
        categories: {},
    };

    let totalCollection = 0;
    const bestiaryFamilies = {};
    for (const [name, value] of Object.entries(profile.bestiary || {})) {
        if (name.startsWith('kills_family_')) {
            bestiaryFamilies[name] = value;
        }
    }

    for (const family of Object.keys(bestiary)) {
        result.categories[family] = {};
        for (const mob of bestiary[family].mobs) {
            const mobName = mob.lookup.substring(13);
            let kills = 0;

            kills = bestiaryFamilies[mob.lookup] || 0;

            const boss = mob.boss ? 'boss' : 'regular';
            let tier = bestiaryKills[boss].filter((k) => k <= kills).length;
            let toTier = bestiaryKills[boss][tier] - (kills || 0);

            if (tier >= bestiary[family].max) {
                tier = bestiary[family].max;
                toTier = null;
            }
            totalCollection += tier;
            result.categories[family][mobName] = {
                kills: kills || 0,
                tier: tier || 0,
                nextTier: toTier,
            };
        }
    }

    result.level = totalCollection / 10;

    return result;
};
