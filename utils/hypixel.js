//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const getRank = require('../stats/rank');
const getHypixelLevel = require('../stats/hypixelLevel');
const getSkills = require('../stats/skills');
const getMilestones = require('../stats/milestones');
const getCakebag = require('../stats/cakebag');
const getMinions = require('../stats/minions');
const getSlayer = require('../stats/slayer');
const getKills = require('../stats/kills');
const getDeaths = require('../stats/deaths');
const { getPets } = require('../stats/pets');
const getEquipment = require('../stats/equipment');
const getArmor = require('../stats/armor');
const getTalismans = require('../stats/talismans');
const getCollections = require('../stats/collections');
const getMining = require('../stats/mining');
const getDungeons = require('../stats/dungeons.js');
const getTrophyFish = require('../stats/trophyFishing');
const getCrimson = require('../stats/crimson.js');
const getWeight = require('../stats/weight');
const getMissing = require('../stats/missing');
const getBestiary = require('../stats/bestiary');
const { isUuid } = require('./uuid');

const { getNetworth, getPrices } = require('skyhelper-networth');

const getContent = require('../stats/items');

let prices = {};
getPrices().then((data) => {
    prices = data;
});
setInterval(async () => {
    prices = await getPrices();
}, 1000 * 60 * 5); // 5 minutes

module.exports = {
    parseHypixel: function parseHypixel(playerRes, uuid, res) {
        if (playerRes.data.hasOwnProperty('player') && playerRes.data.player == null) {
            res.status(404).json({ status: 404, reason: `Found no Player data for a user with a UUID of '${uuid}'` });
            return;
        }
        const data = playerRes.data.player;
        const achievements = data.achievements;

        return {
            name: data.displayname,
            rank: getRank(data),
            hypixelLevel: getHypixelLevel(data),
            karma: data.karma,
            skills: {
                mining: achievements?.skyblock_excavator || 0,
                foraging: achievements?.skyblock_gatherer || 0,
                enchanting: achievements?.skyblock_augmentation || 0,
                farming: achievements?.skyblock_harvester || 0,
                combat: achievements?.skyblock_combat || 0,
                fishing: achievements?.skyblock_angler || 0,
                alchemy: achievements?.skyblock_concoctor || 0,
                taming: achievements?.skyblock_domesticator || 0,
            },
            dungeons: {
                secrets: achievements?.skyblock_treasure_hunter || 0,
            },
        };
    },
    parseNetworthProfile: async function parseNetworthProfile(profileRes, uuid, profileid, res) {
        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
            return;
        }
        if (!isUuid(profileid)) {
            for (const profile of profileRes.data?.profiles || []) {
                if (profile.cute_name.toLowerCase() === profileid.toLowerCase()) {
                    profileid = profile.profile_id;
                }
            }
        }

        const profileData = profileRes.data.profiles.find((a) => a.profile_id === profileid);
        if (!profileData) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
            return;
        }

        if (!isValidProfile(profileData.members, uuid)) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'` });
            return;
        }

        const profile = profileData.members[uuid];

        return {
            uuid: uuid,
            name: profileData.cute_name,
            id: profileData.profile_id,
            selected: profileData.selected,
            first_join: profile.first_join,
            gamemode: profileData?.game_mode || 'normal',
            purse: profile.coin_purse || 0,
            bank: profileData.banking?.balance || 0,
            networth: await getNetworth(profile, profileData.banking?.balance, { prices }),
        };
    },
    parseProfile: async function parseProfile(player, profileRes, uuid, profileid, res) {
        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
            return;
        }
        if (!isUuid(profileid)) {
            for (const profile of profileRes.data?.profiles || []) {
                if (profile.cute_name.toLowerCase() === profileid.toLowerCase()) {
                    profileid = profile.profile_id;
                }
            }
        }

        const profileData = profileRes.data.profiles.find((a) => a.profile_id === profileid);
        if (!profileData) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
            return;
        }

        if (!isValidProfile(profileData.members, uuid)) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'` });
            return;
        }

        const profile = profileData.members[uuid];

        const [networth, weight, crimson, trophy_fish, missing, armor, equipment, pets, talismans, cakebag] = await Promise.all([
            getNetworth(profile, profileData.banking?.balance, { prices }),
            getWeight(profile),
            getCrimson(profile),
            getTrophyFish(profile),
            getMissing(profile),
            getArmor(profile),
            getEquipment(profile),
            getPets(profile),
            getTalismans(profile),
            getCakebag(profile),
        ]);

        return {
            uuid: uuid,
            name: profileData.cute_name,
            id: profileData.profile_id,
            rank: player.rank,
            hypixelLevel: player.hypixelLevel,
            karma: player.karma,
            isIronman: profileData?.game_mode === 'ironman' ? true : false,
            gamemode: profileData?.game_mode ?? 'normal',
            selected: profileData.selected,
            first_join: profile.first_join,
            fairy_souls: profile.fairy_souls_collected || 0,
            purse: profile.coin_purse || 0,
            bank: profileData.banking?.balance || 0,
            sblevel: profile.leveling?.experience/100 || 0,
            skills: getSkills(profile),
            networth,
            weight,
            bestiary: getBestiary(profile),
            dungeons: getDungeons(player, profile),
            crimson,
            trophy_fish,
            mining: getMining(player, profile),
            slayer: getSlayer(profile),
            milestones: getMilestones(profile),
            missing,
            kills: getKills(profile),
            deaths: getDeaths(profile),
            armor,
            equipment,
            pets,
            talismans,
            collections: getCollections(profileData),
            minions: getMinions(profileData),
            cakebag,
        };
    },
    parseNetworthProfiles: async function parseNetworthProfiles(profileRes, uuid, res) {
        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
            return;
        }

        const result = [];

        for (const profileData of profileRes.data.profiles) {
            if (!isValidProfile(profileData.members, uuid)) {
                continue;
            }
            const profile = profileData.members[uuid];

            result.push({
                uuid: uuid,
                name: profileData.cute_name,
                id: profileData.profile_id,
                selected: profileData.selected,
                first_join: profile.first_join,
                gamemode: profileData?.game_mode || 'normal',
                purse: profile.coin_purse || 0,
                bank: profileData.banking?.balance || 0,
                networth: await getNetworth(profile, profileData.banking?.balance, { prices }),
            });
        }
        if (result.length == 0) res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
        return result.sort((a, b) => b.selected - a.selected);
    },
    parseProfiles: async function parseProfile(player, profileRes, uuid, res) {
        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
            return;
        }

        const result = [];

        for (const profileData of profileRes.data.profiles) {
            if (!isValidProfile(profileData.members, uuid)) {
                continue;
            }
            const profile = profileData.members[uuid];

            const [networth, weight, crimson, trophy_fish, missing, armor, equipment, pets, talismans, cakebag] = await Promise.all([
                getNetworth(profile, profileData.banking?.balance, { prices }),
                getWeight(profile),
                getCrimson(profile),
                getTrophyFish(profile),
                getMissing(profile),
                getArmor(profile),
                getEquipment(profile),
                getPets(profile),
                getTalismans(profile),
                getCakebag(profile),
            ]);

            result.push({
                username: player.name,
                uuid: uuid,
                name: profileData.cute_name,
                id: profileData.profile_id,
                rank: player.rank,
                hypixelLevel: player.hypixelLevel,
                karma: player.karma,
                isIronman: profileData?.game_mode === 'ironman' ? true : false,
                gamemode: profileData?.game_mode ?? 'normal',
                selected: profileData.selected,
                first_join: profile.first_join,
                fairy_souls: profile.fairy_souls_collected || 0,
                purse: profile.coin_purse || 0,
                bank: profileData.banking?.balance || 0,
                sblevel: profile.leveling?.experience/100 || 0,
                skills: getSkills(profile),
                networth,
                weight,
                bestiary: getBestiary(profile),
                dungeons: getDungeons(player, profile),
                crimson,
                trophy_fish,
                mining: getMining(player, profile),
                slayer: getSlayer(profile),
                milestones: getMilestones(profile),
                missing,
                kills: getKills(profile),
                deaths: getDeaths(profile),
                armor,
                equipment,
                pets,
                talismans,
                collections: getCollections(profileData),
                minions: getMinions(profileData),
                cakebag,
            });
        }
        if (result.length == 0) res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });

        return result.sort((a, b) => b.selected - a.selected);
    },
    parseProfileItems: async function parseProfileItems(player, profileRes, uuid, profileid, res) {
        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
            return;
        }

        if (!isUuid(profileid)) {
            for (const profile of profileRes.data?.profiles || []) {
                if (profile.cute_name.toLowerCase() === profileid.toLowerCase()) {
                    profileid = profile.profile_id;
                }
            }
        }

        const profileData = profileRes.data.profiles.find((a) => a.profile_id === profileid);
        if (!profileData) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}' and profile of '${profileid}'` });
            return;
        }

        if (!isValidProfile(profileData.members, uuid)) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'` });
            return;
        }

        const profile = profileData.members[uuid];

        return {
            username: player.name,
            uuid: uuid,
            name: profileData.cute_name,
            id: profileData.profile_id,
            selected: profileData.selected,
            data: await getContent(profile),
        };
    },

    parseProfilesItems: async function parseProfileItems(player, profileRes, uuid, res) {
        if (profileRes.data.hasOwnProperty('profiles') && profileRes.data.profiles == null) {
            res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
            return;
        }

        const result = [];

        for (const profileData of profileRes.data.profiles) {
            if (!isValidProfile(profileData.members, uuid)) {
                continue;
            }
            const profile = profileData.members[uuid];

            result.push({
                username: player.name,
                uuid: uuid,
                name: profileData.cute_name,
                id: profileData.profile_id,
                selected: profile.selected,
                data: await getContent(profile),
            });
        }
        if (result.length == 0) res.status(404).json({ status: 404, reason: `Found no SkyBlock profiles for a user with a UUID of '${uuid}'.` });
        return result.sort((a, b) => b.selected - a.selected);
    },
};

function isValidProfile(profileMembers, uuid) {
    return profileMembers.hasOwnProperty(uuid) && profileMembers[uuid] !== undefined;
}
