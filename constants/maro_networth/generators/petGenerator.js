const constants = require('../src/constants');
const helper = require('../src/helper');

const getPricesFromDb = function (pet, db) {
    let lvl1 = db[`lvl_1_${pet.tier}_${pet.type}`.toLowerCase()]?.price;
    let lvl100 = db[`lvl_100_${pet.tier}_${pet.type}`.toLowerCase()]?.price;
    let lvl200 = db[`lvl_200_${pet.tier}_${pet.type}`.toLowerCase()]?.price;

    if (pet.skin) {
        lvl1 = db[`lvl_1_${pet.tier}_${pet.type}_skinned_${pet.skin}`.toLowerCase()]?.price || lvl1;
        lvl100 = db[`lvl_100_${pet.tier}_${pet.type}_skinned_${pet.skin}`.toLowerCase()]?.price || lvl100;
        lvl200 = db[`lvl_200_${pet.tier}_${pet.type}_skinned_${pet.skin}`.toLowerCase()]?.price || lvl200;
    }

    return { lvl1, lvl100, lvl200 };
};

const calculateSkillLevel = function (pet) {
    const maxLevel = pet.type == 'GOLDEN_DRAGON' ? 200 : 100;
    const rarityOffset = constants.pet_rarity_offset[pet.tier];
    const levels = constants.pet_levels.slice(rarityOffset, rarityOffset + maxLevel - 1);

    let level = 1;
    let totalExperience = 0;

    for (let i = 0; i < maxLevel; i++) {
        totalExperience += levels[i];

        if (totalExperience > pet.exp) {
            totalExperience -= levels[i];
            break;
        }

        level++;
    }

    return {
        xpMax: levels.reduce((a, b) => a + b, 0),
        level: level > maxLevel ? maxLevel : level,
    };
};

const getPetPrice = function (pet, db) {
    const { lvl1, lvl100, lvl200 } = getPricesFromDb(pet, db);

    if (lvl1 == undefined || lvl100 == undefined) {
        return pet;
    }

    let data = calculateSkillLevel(pet);
    let price = lvl200 ?? lvl100;

    if (data.level < 100 && data.xpMax) {
        const baseFormula = (lvl100 - lvl1) / data.xpMax;

        if (baseFormula != undefined) {
            price = baseFormula * pet.exp + lvl1;
        }
    }

    if (data.level > 100 && data.level < 200) {
        const level = data.level.toString().slice(1);

        if (level != 1) {
            const baseFormula = (lvl200 - lvl100) / 100;

            price = baseFormula * level + lvl100;
        }
    }

    if (pet.heldItem) {
        const heldItemPrice = db[pet.heldItem.toLowerCase()]?.price;

        if (heldItemPrice != undefined) {
            price += heldItemPrice;
        }
    }

    if (pet.candyUsed > 0 && pet.type !== 'ENDER_DRAGON' && pet.type !== 'GOLDEN_DRAGON' && pet.type !== 'SCATHA') {
        const reducedValue = price / 1.538232;

        if (!isNaN(price)) {
            if (data.level === 100) {
                price = Math.max(reducedValue, price - 5000000);
            } else {
                price = Math.max(reducedValue, price - 2500000);
            }
        }
    }

    pet.price = price;
    pet.modified = { name: `[Lvl ${data.level}] ${helper.capitalize(`${pet.tier} ${pet.type}`)}${pet.skin ? ' ✦' : ''}`, isPet: true };

    return pet;
};

module.exports = { calculateSkillLevel, getPetPrice };