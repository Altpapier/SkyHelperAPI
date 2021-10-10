const milestones = require('../constants/milestones')

module.exports = function getMilestones(profile) {

    const dolphin = getCurrentPet('dolphin', profile.stats.pet_milestone_sea_creatures_killed || 0)
    const rock = getCurrentPet('rock', profile.stats.pet_milestone_ores_mined || 0)

    return {
        fishing: {
            sea_creatures_killed: dolphin.stats,
            current_pet: milestones.raritys[dolphin.level-1],
            next_pet: dolphin.xpForNext,
            progress: dolphin.progress
        },
        mining: {
            ores_mined: rock.stats,
            current_pet: milestones.raritys[rock.level-1],
            next_pet: rock.xpForNext,
            progress: rock.progress
        }
    }
}

function getCurrentPet(pet, stats) {
    let level = 0;
    let xpForNext = 0;
    let progress = 0;
    for (let i = 0; i < 5; i++) {
        if (milestones[pet][i] < stats) level = i + 1;
    }
    if (level < 5) {
        xpForNext = Math.ceil(milestones[pet][level])
    }
    progress = Math.max(0, Math.min(stats / xpForNext, 1));
    return {
        stats,
        level,
        xpForNext,
        progress
    }
}