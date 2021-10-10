const calculateWeight = require('../constants/weight')
const calcSkill = require('../constants/skills')

module.exports = (profile) => {
    return {
        skills: {
            farming: calculateWeight('farming', (calcSkill('farming', profile?.experience_skill_farming || 0)).level, profile?.experience_skill_farming || 0),
            mining: calculateWeight('mining', (calcSkill('mining', profile?.experience_skill_mining || 0)).level, profile?.experience_skill_mining || 0),
            combat: calculateWeight('combat', (calcSkill('combat', profile?.experience_skill_combat || 0)).level, profile?.experience_skill_combat || 0),
            foraging: calculateWeight('foraging', (calcSkill('foraging', profile?.experience_skill_foraging || 0)).level, profile?.experience_skill_foraging || 0),
            fishing: calculateWeight('fishing', (calcSkill('fishing', profile?.experience_skill_fishing || 0)).level, profile?.experience_skill_fishing || 0),
            enchanting: calculateWeight('enchanting', (calcSkill('enchanting', profile?.experience_skill_enchanting || 0)).level, profile?.experience_skill_enchanting || 0),
            alchemy: calculateWeight('alchemy', (calcSkill('alchemy', profile?.experience_skill_alchemy || 0)).level, profile?.experience_skill_alchemy || 0),
            taming: calculateWeight('taming', (calcSkill('taming', profile?.experience_skill_taming || 0)).level, profile?.experience_skill_taming || 0)
        },
        slayer: {
            revenant: calculateWeight('revenant', null, profile.slayer_bosses?.zombie.xp || 0),
            tarantula: calculateWeight('tarantula', null, profile.slayer_bosses?.spider.xp || 0),
            sven: calculateWeight('sven', null, profile.slayer_bosses?.wolf.xp || 0),
            enderman: calculateWeight('enderman', null, profile.slayer_bosses?.enderman?.xp || 0)
        },
        dungeons: {
            catacombs: calculateWeight('catacombs', (calcSkill('dungeoneering', profile.dungeons?.dungeon_types.catacombs.experience || 0)).level, profile.dungeons?.dungeon_types.catacombs.experience),
            classes: {
                healer: calculateWeight('healer', (calcSkill('dungeoneering', profile.dungeons?.player_classes.healer.experience || 0)).level, profile.dungeons?.player_classes.healer.experience),
                mage: calculateWeight('mage', (calcSkill('dungeoneering', profile.dungeons?.player_classes.mage.experience || 0)).level, profile.dungeons?.player_classes.mage.experience),
                berserk: calculateWeight('berserk', (calcSkill('dungeoneering', profile.dungeons?.player_classes.berserk.experience || 0)).level, profile.dungeons?.player_classes.berserk.experience),
                archer: calculateWeight('archer', (calcSkill('dungeoneering', profile.dungeons?.player_classes.archer.experience || 0)).level, profile.dungeons?.player_classes.archer.experience),
                tank: calculateWeight('tank', (calcSkill('dungeoneering', profile.dungeons?.player_classes.tank.experience || 0)).level, profile.dungeons?.player_classes.tank.experience),
            }
        }
    }
}