import AoA from '../expansions/AoA';
import CotA from '../expansions/CotA';
import WC from '../expansions/WC';
import MM from '../expansions/MM';
import DT from '../expansions/DT';

const sets = [
  'cota',
  'aoa',
  'wc',
  'mm',
  'dt',
];
const data = {};
const setMap = {
  mm: MM,
  cota: CotA,
  aoa: AoA,
  wc: WC,
  dt: DT,
};

for (const set of sets) {
  setMap[set].cards.forEach((card) => {
    if (data[card.name]) {
      data[card.name].expansion.push(card.expansion);
    } else {
      data[card.name] = card;
      data[card.name].expansion = [ data[card.name].expansion ];
    }
  });
}

data._done = true;
data['Quixo the "Adventurer"'] = data['Quixo the “Adventurer”'];
data['Vault\'s Blessing'] = data['Vault’s Blessing'];
data['"John Smyth"'] = data['“John Smyth”'];
data['"Lion" Bautrem'] = data['“Lion” Bautrem'];
data['EDAI "Edie" 4x4'] = data['EDAI “Edie” 4x4'];

export default data;
