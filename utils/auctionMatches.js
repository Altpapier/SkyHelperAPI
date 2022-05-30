const tiers = {
    COMMON: '#FEFEFE',
    UNCOMMON: '#55FF55',
    RARE: '#5555FF',
    EPIC: '#AA00AA',
    LEGENDARY: '#FFAA00',
    MYTHIC: '#FF55FF',
    DIVINE: '#55FFFF',
    SPECIAL: '#FF5555',
    VERY_SPECIAL: '#FF5555',
};
const gemstones = {
    slotTypes: ['COMBAT', 'OFFENSIVE', 'DEFENSIVE', 'MINING', 'UNIVERSAL'],
    tiers: ['ROUGH', 'FLAWED', 'FINE', 'FLAWLESS', 'PERFECT'],
    types: ['RUBY', 'AMBER', 'SAPPHIRE', 'JADE', 'AMETHYST', 'TOPAZ', 'JASPER', 'OPAL'],
};

function nameMatches(search, test) {
    const searches = search.split(' ');
    let matchedWords = 0;

    searches.forEach((s) => {
        if (test.includes(s)) {
            matchedWords++;
        }
    });

    return matchedWords === 0 ? 0 : matchedWords / searches.length;
}

function tierMatches(search, test) {
    if (!search) return 1;
    if (!test) return 0;
    if (search.value && search.value !== 'none' && search.value !== 'ignore') {
        const searchIndex = Object.keys(tiers).indexOf(search.value);
        const testIndex = Object.keys(tiers).indexOf(test);
        if (search.greater_than_equal_to && searchIndex <= testIndex) {
            return 1;
        } else if (searchIndex !== testIndex) {
            return 0;
        }
    }

    return 1;
}

function enchantmentsMatch(search = [], test = {}) {
    if (search.length < 1) return 1;
    if (Object.keys(test).length < 1) return 0;

    let metEnchantments = 0;
    search.forEach((enchantment) => {
        let value = 0;
        if (enchantment.name === 'aiming' || enchantment.name === 'dragon_tracer') value = test.aiming || test.dragon_tracer;
        else value = test[enchantment.name.toLowerCase().replaceAll(' ', '_')];
        if (value >= enchantment.tier) metEnchantments++;
        else if (value && enchantment.tier) metEnchantments += value / enchantment.tier;
    });

    return metEnchantments / search.length;
}

function petInfoMatches(searches = [], test = {}) {
    if (searches.length < 1) return 1;
    if (Object.keys(test).length < 1) return 0;

    let matchedAttributes = 0;
    searches.forEach((info) => {
        const matches = testAttrbiute(info, test[info.name]);
        if (matches === true) matchedAttributes++;
        else if (matches) matchedAttributes += matches;
    });

    return matchedAttributes / searches.length;
}

function extraAttributesMatch(searches = [], test = {}) {
    if (searches.length < 1) return 1;
    if (Object.keys(test).length < 1) return 0;

    let matchedAttributes = 0;
    searches.forEach((attribute) => {
        let matches = testAttrbiute(attribute, test[attribute.name]);
        if (attribute.name === 'upgrade_level') {
            const newMatches = testAttrbiute(attribute, test.dungeon_item_level);
            if (newMatches > matches) matches = newMatches;
        }
        if (matches === true) matchedAttributes++;
        else if (matches) matchedAttributes += matches;
    });

    return matchedAttributes / searches.length;
}

function attributesMatch(search = [], test = {}) {
    if (search.length < 1) return 1;
    if (Object.keys(test).length < 1) return 0;

    let metAttributes = 0;
    search.forEach((attribute) => {
        if (test[attribute.id] >= attribute.tier) metAttributes++;
        else if (test[attribute.id] && attribute.tier) metAttributes += test[attribute.id] / attribute.tier;
    });

    return metAttributes / search.length;
}

function testAttrbiute(attribute, test) {
    if (attribute == undefined || attribute == null || test == undefined || test == null) return false;

    let matches = true;
    if (attribute.less_than_equal_to) {
        if (test <= parseInt(attribute.value, 10)) return 1;
        else if (test && parseInt(attribute.value, 10)) return parseInt(attribute.value, 10) / test;
        else return 0;
    } else if (attribute.greater_than_equal_to) {
        if (test >= parseInt(attribute.value, 10)) return 1;
        else if (test < parseInt(attribute.value, 10)) return test / parseInt(attribute.value, 10);
        else return 0;
    } else if (attribute.includes) {
        if (!test.toLowerCase().includes(attribute.value.toLowerCase())) matches = false;
    } else if (test != attribute.value) {
        matches = false;
    }

    if (attribute.not) return !matches;
    else return matches;
}

function testGems(searches = [], tmpTest = {}) {
    // Max 7 gems
    const test = { ...tmpTest };
    if (searches.length < 1) return 1;
    if (Object.keys(test).length < 1) return 0;

    let matchedGems = 0;
    searches.forEach((gem) => {
        const testGem = findGem(gem, test);

        if (testGem) {
            matchedGems++;
            if (gemstones.slotTypes.includes(testGem.slice(0, -2))) {
                delete test[`${testGem}_gem`];
            }
            delete test[testGem];
        }
    });

    return matchedGems / searches.length;
}

function findGem(search, test) {
    return Object.keys(test).find((gem) => {
        if (!(typeof test[gem] === 'string')) return false;
        const tierOrHigher = gemTierOrHigher(search.tier, test[gem]);

        if (gemstones.slotTypes.includes(gem.slice(0, -2))) {
            return test[`${gem}_gem`].includes(search.type) && tierOrHigher;
        } else {
            return gem.toLowerCase().includes(search.type) && tierOrHigher;
        }
    });
}

function gemTierOrHigher(search, test) {
    if (!search) return true;
    const searchTiers = gemstones.tiers.slice(gemstones.tiers.indexOf(search.toUpperCase()));
    return searchTiers.includes(test.split('_')[0]);
}

function abilityScrollsMatch(search = [], test = []) {
    if (search.length < 1) return 1;
    if (test.length < 1) return 0;

    let metScrolls = 0;
    search.forEach((scroll) => {
        if (test.includes(scroll)) metScrolls++;
    });

    return metScrolls / search.length;
}

function auctionMatches(search, test) {
    if ((search.bin === 1 && !test.bin) || (search.bin === 2 && test.bin)) return 0;

    let count = 2;
    let score = tierMatches(search.tier, test.tier);

    if (search.id) {
        if (search.id === test.ExtraAttributes.id) score++;
        else return 0;
    } else {
        if (!search.itemName || search.itemName.toLowerCase() === 'none') {
            score++;
        } else {
            const nameScore = nameMatches(search.itemName.toLowerCase().replace(/[^A-Za-z0-9[\] ]/g, ''), test.item_name.toLowerCase().replace(/[^A-Za-z0-9[\] ]/g, ''));
            if (nameScore < 0.66) return 0;
            else score += nameScore;
        }
    }

    if (search.enchantments?.length > 0) {
        score += enchantmentsMatch(search.enchantments, test.enchantments);
        count++;
    }

    if (search.petInfo?.length > 0) {
        score += petInfoMatches(search.petInfo, test.petInfo);
        count++;
    }

    if (search.ExtraAttributes?.length > 0) {
        score += extraAttributesMatch(search.ExtraAttributes, test.ExtraAttributes);
        count++;
    }

    if (search.rune) {
        if (!isNaN(test.runes?.[search.rune.name])) {
            if (test.runes[search.rune.name] >= search.rune.tier) score++;
            else score += test.runes[search.rune.name] / search.rune.tier;
        }
        count++;
    }

    if (search.gems?.length > 0) {
        score += testGems(search.gems, test.gems);
        count++;
    }

    if (search.attributes?.length > 0) {
        score += attributesMatch(search.attributes, test.attributes);
        count++;
    }

    if (search.abilityScroll?.length > 0) {
        score += abilityScrollsMatch(search.abilityScroll, test.ExtraAttributes?.ability_scroll);
        count++;
    }

    return score / count;
}

module.exports = {
    auctionMatches,
};
