const calcSkill = require('../constants/skills');

module.exports = function getSkills(profile, weight) {
    const skill_experience = {
        farming: profile?.experience_skill_farming || 0,
        mining: profile?.experience_skill_mining || 0,
        combat: profile?.experience_skill_combat || 0,
        foraging: profile?.experience_skill_foraging || 0,
        fishing: profile?.experience_skill_fishing || 0,
        enchanting: profile?.experience_skill_enchanting || 0,
        alchemy: profile?.experience_skill_alchemy || 0,
        carpentry: profile?.experience_skill_carpentry || 0,
        runecrafting: profile?.experience_skill_runecrafting || 0,
        social: profile?.experience_skill_social2 || 0,
        taming: profile?.experience_skill_taming || 0,
    };

    return {
        farming: calcSkill('farming', skill_experience['farming'], weight),
        mining: calcSkill('mining', skill_experience['mining'], weight),
        combat: calcSkill('combat', skill_experience['combat'], weight),
        foraging: calcSkill('foraging', skill_experience['foraging'], weight),
        fishing: calcSkill('fishing', skill_experience['fishing'], weight),
        enchanting: calcSkill('enchanting', skill_experience['enchanting'], weight),
        alchemy: calcSkill('alchemy', skill_experience['alchemy'], weight),
        carpentry: calcSkill('carpentry', skill_experience['carpentry'], weight),
        runecrafting: calcSkill('runecrafting', skill_experience['runecrafting'], weight),
        social: calcSkill('social', skill_experience['social'], weight),
        taming: calcSkill('taming', skill_experience['taming'], weight),
    };
};
