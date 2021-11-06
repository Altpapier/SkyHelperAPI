//CREDIT: https://github.com/SkyCryptWebsite/SkyCrypt (Modified)
const pet_levels = [
    100, 110, 120, 130, 145, 160, 175, 190,
    210, 230, 250, 275, 300, 330, 360, 400,
    440, 490, 540, 600, 660, 730, 800, 880,
    960, 1050, 1150, 1260, 1380, 1510, 1650, 1800,
    1960, 2130, 2310, 2500, 2700, 2920, 3160, 3420,
    3700, 4000, 4350, 4750, 5200, 5700, 6300, 7000,
    7800, 8700, 9700, 10800, 12000, 13300, 14700, 16200,
    17800, 19500, 21300, 23200, 25200, 27400, 29800, 32400,
    35200, 38200, 41400, 44800, 48400, 52200, 56200, 60400,
    64800, 69400, 74200, 79200, 84700, 90700, 97200, 104200,
    111700, 119700, 128200, 137200, 146700, 156700, 167700, 179700,
    192700, 206700, 221700, 237700, 254700, 272700, 291700, 311700,
    333700, 357700, 383700, 411700,  441700,  476700, 516700,  561700,
    611700, 666700,  726700,  791700, 861700,  936700, 1016700, 1101700,
    1191700, 1286700, 1386700, 1496700, 1616700, 1746700, 1886700
]

const pet_rarity_offset = { common: 0, uncommon: 6, rare: 11, epic: 16, legendary: 20, mythic: 20 }
module.exports = function getPet(pet) {
    const rarityOffset = pet_rarity_offset[pet.tier.toLowerCase()]
    const levels = pet_levels.slice(rarityOffset, rarityOffset + 99)

    const xpMaxLevel = levels.reduce((a, b) => a + b, 0)
    let xpTotal = 0
    let level = 1
    let xpForNext = Infinity

    for (let i = 0; i < 100; i++) {
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

    if (level < 100) {
        xpForNext = Math.ceil(levels[level - 1]);
        progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
    } else {
        level = 100;
        xpCurrent = pet.exp - levels[99];
        xpForNext = 0;
        progress = 1;
    }
    return { level, xpCurrent, xpForNext, progress, xpMaxLevel, tier: pet.tier.toLowerCase(), type: pet.type, heldItem: pet.heldItem, skin: pet.skin }
}