const xp_tables = require('../constants/xp_tables')
const { titleCase } = require('../constants/functions')

module.exports = (profile) => {
    const pets = profile?.pets
    if (pets) {
        const all_pets = []
        for (let pet of pets) {
            all_pets.push(getPet(pet))
        }
        return {
            auto_pet: profile.autopet,
            all_pets,
        }   
    } else {
        return []
    }
}

function getPet(pet) {
    let rarity = pet.tier.toLowerCase()
    let pet_rarity_offset = { common: 0, uncommon: 6, rare: 11, epic: 16, legendary: 20, mythic: 20 }
    const rarityOffset = pet_rarity_offset[rarity]
    const levels = xp_tables.pets.slice(rarityOffset, rarityOffset + 99)
    let xpTotal = 0
    let level = 1
    let xpForNext = Infinity
    let maxLevel = pet.type === 'GOLDEN_DRAGON' ? 200 : 100
    for (let i = 0; i < maxLevel; i++) {
        xpTotal += levels[i];
        if (xpTotal > pet.exp) {
            xpTotal -= levels[i];
            break;
        } else {
            level++;
        }
    }
    let xpCurrent = Math.floor(pet.exp - xpTotal)
    let progress
    if (level < maxLevel) {
        xpForNext = Math.ceil(levels[level - 1]);
        progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
    } else {
        level = maxLevel;
        xpCurrent = pet.exp - levels[98];
        xpForNext = 0;
        progress = 1;
    }
    let name = `[Lvl ${level}] ${titleCase(pet.type.replace(/_/g, ' '))}${pet.skin ? ' ✦' : ''}`
    return { name, level, xpCurrent, xpForNext, progress, tier: pet.tier, type: pet.type, exp: pet.exp, skin: pet.skin }
}