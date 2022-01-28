const calculateWeight = require('../constants/weight')
const calcSkill = require('../constants/skills')

module.exports = (profile) => {
    const weight = {
        skills: {
            farming: calculateWeight('farming', (calcSkill('farming', profile?.experience_skill_farming || 0)).levelWithProgress, profile?.experience_skill_farming || 0),
            mining: calculateWeight('mining', (calcSkill('mining', profile?.experience_skill_mining || 0)).levelWithProgress, profile?.experience_skill_mining || 0),
            combat: calculateWeight('combat', (calcSkill('combat', profile?.experience_skill_combat || 0)).levelWithProgress, profile?.experience_skill_combat || 0),
            foraging: calculateWeight('foraging', (calcSkill('foraging', profile?.experience_skill_foraging || 0)).levelWithProgress, profile?.experience_skill_foraging || 0),
            fishing: calculateWeight('fishing', (calcSkill('fishing', profile?.experience_skill_fishing || 0)).levelWithProgress, profile?.experience_skill_fishing || 0),
            enchanting: calculateWeight('enchanting', (calcSkill('enchanting', profile?.experience_skill_enchanting || 0)).levelWithProgress, profile?.experience_skill_enchanting || 0),
            alchemy: calculateWeight('alchemy', (calcSkill('alchemy', profile?.experience_skill_alchemy || 0)).levelWithProgress, profile?.experience_skill_alchemy || 0),
            taming: calculateWeight('taming', (calcSkill('taming', profile?.experience_skill_taming || 0)).levelWithProgress, profile?.experience_skill_taming || 0)
        },
        slayer: {
            revenant: calculateWeight('revenant', null, profile.slayer_bosses?.zombie?.xp || 0),
            tarantula: calculateWeight('tarantula', null, profile.slayer_bosses?.spider?.xp || 0),
            sven: calculateWeight('sven', null, profile.slayer_bosses?.wolf?.xp || 0),
            enderman: calculateWeight('enderman', null, profile.slayer_bosses?.enderman?.xp || 0)
        },
        dungeons: {
            catacombs: calculateWeight('catacombs', (calcSkill('dungeoneering', profile.dungeons?.dungeon_types?.catacombs?.experience || 0)).levelWithProgress, profile.dungeons?.dungeon_types?.catacombs?.experience  || 0),
            classes: {
                healer: calculateWeight('healer', (calcSkill('dungeoneering', profile.dungeons?.player_classes?.healer?.experience || 0)).levelWithProgress, profile.dungeons?.player_classes?.healer?.experience || 0),
                mage: calculateWeight('mage', (calcSkill('dungeoneering', profile.dungeons?.player_classes?.mage?.experience || 0)).levelWithProgress, profile.dungeons?.player_classes?.mage?.experience || 0),
                berserk: calculateWeight('berserk', (calcSkill('dungeoneering', profile.dungeons?.player_classes?.berserk?.experience || 0)).levelWithProgress, profile.dungeons?.player_classes?.berserk?.experience || 0),
                archer: calculateWeight('archer', (calcSkill('dungeoneering', profile.dungeons?.player_classes?.archer?.experience || 0)).levelWithProgress, profile.dungeons?.player_classes?.archer?.experience || 0),
                tank: calculateWeight('tank', (calcSkill('dungeoneering', profile.dungeons?.player_classes?.tank?.experience || 0)).levelWithProgress, profile.dungeons?.player_classes?.tank?.experience || 0),
            }
        }
    }
    return {
        total_weight: weight.skills.farming.weight + weight.skills.mining.weight + weight.skills.combat.weight + weight.skills.foraging.weight + weight.skills.fishing.weight + weight.skills.enchanting.weight + weight.skills.alchemy.weight + weight.skills.taming.weight + weight.slayer.revenant.weight + weight.slayer.tarantula.weight + weight.slayer.sven.weight + weight.slayer.enderman.weight + weight.dungeons.catacombs.weight + weight.dungeons.classes.healer.weight + weight.dungeons.classes.mage.weight + weight.dungeons.classes.berserk.weight + weight.dungeons.classes.archer.weight + weight.dungeons.classes.tank.weight,
        total_weight_with_overflow: weight.skills.farming.weight + weight.skills.mining.weight + weight.skills.combat.weight + weight.skills.foraging.weight + weight.skills.fishing.weight + weight.skills.enchanting.weight + weight.skills.alchemy.weight + weight.skills.taming.weight + weight.slayer.revenant.weight + weight.slayer.tarantula.weight + weight.slayer.sven.weight + weight.slayer.enderman.weight + weight.dungeons.catacombs.weight + weight.dungeons.classes.healer.weight + weight.dungeons.classes.mage.weight + weight.dungeons.classes.berserk.weight + weight.dungeons.classes.archer.weight + weight.dungeons.classes.tank.weight + weight.skills.farming.weight_overflow + weight.skills.mining.weight_overflow + weight.skills.combat.weight_overflow + weight.skills.foraging.weight_overflow + weight.skills.fishing.weight_overflow + weight.skills.enchanting.weight_overflow + weight.skills.alchemy.weight_overflow + weight.skills.taming.weight_overflow + weight.slayer.revenant.weight_overflow + weight.slayer.tarantula.weight_overflow + weight.slayer.sven.weight_overflow + weight.slayer.enderman.weight_overflow + weight.dungeons.catacombs.weight_overflow + weight.dungeons.classes.healer.weight_overflow + weight.dungeons.classes.mage.weight_overflow + weight.dungeons.classes.berserk.weight_overflow + weight.dungeons.classes.archer.weight_overflow + weight.dungeons.classes.tank.weight_overflow,
        weight
    }
}