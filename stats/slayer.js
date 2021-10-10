const xp_tables = require('../constants/xp_tables')

module.exports = (profile) => {
    function getSlayer(slayer) {
        const slayers = profile?.slayer_bosses[slayer]
        const experience = slayers?.xp || 0
        if (experience <= 0) {
            return {
                xp: 0,
                level: 0,
                xpForNext: xp_tables.slayer[0],
                progress: 0,
                kills: {

                }
            }
        }

        let level = 0
        let xpForNext = 0
        let progress = 0
        let maxLevel = 9
    
        for (let i = 0; i < xp_tables.slayer.length; i++) {
            if (xp_tables.slayer[i] <= experience) {
                level = i+1
            }
        }
    
        if (level < maxLevel) {
            xpForNext = Math.ceil(xp_tables.slayer[level])
        }
    
        progress = Math.max(0, Math.min(experience / xpForNext, 1));

        const kills = {}
        if (slayer === 'zombie') kills[5] = 0
        for (let i = 0; i < Object.keys(slayers).length; i++) {
            if (Object.keys(slayers)[i].startsWith('boss_kills_tier_')) {
                // This indeed looks pretty bad I know... (kills[boss tier number])
                kills[Number(Object.keys(slayers)[i].charAt(Object.keys(slayers)[i].length - 1)) + 1] = Object.values(slayers)[i]
            }
        }
    
        return {
            xp: experience,
            level,
            xpForNext,
            progress,
            kills
        }
    }

    return {
        wolf: getSlayer('wolf'),
        zombie: getSlayer('zombie'),
        spider: getSlayer('spider'),
        enderman: getSlayer('enderman')
    }
}

