const petGenerator = require('../generators/petGenerator');
const api = require('../storage/requestHandler');
const helper = require('../src/helper');
const db = require('../storage/database');

let auctions = {};

const fetchAuctions = async function (pages = 0) {
  for (let i = 0; i <= pages; i++) {
    const auctionPage = await api.getAuctionPage(i);
    if (!auctionPage.success) continue;

    pages = auctionPage.totalPages - 1;
    await processAuctions(auctionPage);
  }
  console.log('[PRICES] Got all auctions')

  return await updateAuctions();
};

const ignoredItems = async function () {
  const items = await db.ignoredItems.find({});
  const ids = items.map(i => i.id);

  return ids;
}

const updateAuctions = async function () {
  const ignored = await ignoredItems();
  Object.keys(auctions).forEach(async item => {
    const sales = auctions[item].map(i => ({ price: i.price, count: i.count }));

    if (sales.length && !(ignored.includes(item.toUpperCase()))) {
      const lbin = Math.min(...sales.map(i => i.price));
      const auction = auctions[item].filter(i => i.price === lbin)[0];

      if (item.includes('skinned') && sales.length > 2) {
        let skin = item.split('skinned_').pop()
        let itemName = item.replace(`_skinned_${skin}`, '').toLowerCase();

        await processSkinPrices(skin, itemName, auction);
      } else {
        await db.auctions.updateOne({ id: item.toUpperCase() }, { sales: sales, auction: auction }, { upsert: true })
      }
    }
  });
  console.log('[PRICES] Updated all auctions in the DB')
  auctions = {};
  setTimeout(() => fetchAuctions(), 30 * 10000);
};

const processSkinPrices = async function (skin, itemName, lowest) {
  const data = await db.auctions.findOne({ id: itemName.toUpperCase() });
  const before = { ...data.skinPrices };
  if (data) {
    if (data.skinPrices === undefined) {
      data.skinPrices = {};
    }
    
    data.skinPrices[skin] = lowest.price;

    if (Object.keys(before).length != Object.keys(data.skinPrices).length) await db.auctions.updateOne({ id: itemName.toUpperCase() }, { skinPrices: data.skinPrices });
  }
};

const processAuctions = async function (data) {
  data.auctions
    .filter(a => a.bin)
    .forEach(async auction => {
      const item = await helper.decodeNBT(auction.item_bytes);

      const ExtraAttributes = item.tag.value.ExtraAttributes.value;
      const { id, name } = getAttributes(ExtraAttributes, auction.item_name);

      const format = {
        id: id.toUpperCase(),
        name: helper.capitalize(name),
        price: auction.starting_bid,
        seller: auction.auctioneer,
        ending: auction.end,
        count: item.Count.value
      };

      Object.keys(auctions).includes(id) ? auctions[id].push(format) : (auctions[id] = [format]);
    });
};

const getAttributes = function (item, itemName) {
  let itemId = item.id.value;

  if (itemId == 'ENCHANTED_BOOK' && item.enchantments) {
    const enchants = Object.keys(item.enchantments.value);

    if (enchants.length == 1) {
      const value = item.enchantments.value[enchants[0]].value;

      itemId = `${enchants[0]}_${value}`;
      itemName = helper.capitalize(`${enchants[0]} ${value}`);
    }
  }

  if (item.skin?.value) {
    const skin = item.skin.value;
    itemId = `${itemId}_skinned_${skin}`;
  }

  if (itemId == 'PET') {
    const pet = JSON.parse(item.petInfo.value);
    const data = petGenerator.calculateSkillLevel(pet);

    if (data.level == 1 || data.level == 100 || data.level == 200) {
      if (pet.skin) {
        itemId = `lvl_${data.level}_${pet.tier}_${pet.type}_skinned_${pet.skin}`;
      } else {
        itemId = `lvl_${data.level}_${pet.tier}_${pet.type}`;
      }

      itemName = `[Lvl ${data.level}] ${helper.capitalize(`${pet.tier} ${pet.type}`)}`;
    }
  }

  return {
    id: itemId,
    name: itemName
  };
};

if (process.env.AUTO_UPDATE !== 'false') fetchAuctions();