const isItemRecombobulated = function (item) {
  let recombobulated;

  if (item.tag?.ExtraAttributes?.rarity_upgrades != undefined) {
    recombobulated = true;
  }

  return recombobulated;
};

const getNetworth = async function (data, profile, bank) {
  const output = { categories: {} };

  for (const key of Object.keys(data)) {
    const category = { items: [], total: 0 };

    for (const item of data[key].filter((i) => i.price)) {
      category.total += item.price;
      category.items.push({
        id: item.modified.id,
        name: item.modified.name,
        price: parseInt(item.price),
        recomb: isItemRecombobulated(item),
        heldItem: item.heldItem,
        winning_bid: item?.tag?.ExtraAttributes?.winning_bid,
        base: item?.modified?.base,
        calculation: item?.modified?.calculation,
        candyUsed: item.candyUsed,
        count: item.Count ?? 1,
      });
    }

    if (category.items.length > 0) {
      output.categories[key] = {
        total: parseInt(category.total),
        top_items: category.items
          .sort((a, b) => b.price - a.price)
          .filter((e) => e),
      };
    }
  }

  output.bank = bank || 0;
  output.purse = profile.coin_purse ?? 0;

  output.networth =
    Object.values(output.categories).reduce((a, b) => a + b.total, 0) +
    output.bank + output.purse;

  return output;
};

module.exports = { getNetworth };
