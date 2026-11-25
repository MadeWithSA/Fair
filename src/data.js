const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`
export const COLORS = {
  default: ['#CBD5E1', '#F8FAFC', '#334155'],
}
// type -> i18n.types[type]; specs -> [labelKey, value]
export const PRODUCTS = [
  { id: 'coffee', type: 'coffee', model: 'Fair Barista Pro X9', cat: 'kitchen', price: 7490000, old: 8900000, rating: 4.98, rev: 312, likes: 428, badge: 'hit', img: u('photo-1517668808822-9ebb02f2a0e6'), specs: [['power', '1850 W'], ['pressure', '20 bar'], ['capacity', '2.2 L']] },
  { id: 'robot', type: 'robot', model: 'Fair RoboClean S8 Ultra', cat: 'cleaning', price: 6290000, old: 8400000, rating: 4.95, rev: 245, likes: 519, badge: 'sale', img: u('photo-1558317374-067fb5f30001'), specs: [['suction', '8000 Pa'], ['runtime', '180 min'], ['noise', '52 dB']] },
  { id: 'fridge', type: 'fridge', model: 'Fair FrostGuard Side-by-Side', cat: 'large', price: 14850000, old: 16900000, rating: 4.96, rev: 94, likes: 312, badge: 'new', img: u('photo-1584568694244-14fbdf83bd30'), specs: [['capacity', '580 L'], ['noise', '37 dB'], ['size', '91×179×70 cm']] },
  { id: 'tv', type: 'tv', model: 'Fair Vision 65" OLED evo', cat: 'tv', price: 16400000, old: 18500000, rating: 4.99, rev: 178, likes: 645, badge: 'hit', img: u('photo-1593359677879-a4bb92f829d1'), specs: [['screen', '65" 4K OLED'], ['speed', '120 Hz'], ['power', '60 W']] },
  { id: 'washer', type: 'washer', model: 'Fair AquaSteam 10.5', cat: 'large', price: 6890000, old: 8100000, rating: 4.92, rev: 163, likes: 289, badge: 'sale', img: u('photo-1626806787461-102c1bfaaea1'), specs: [['capacity', '10.5 kg'], ['speed', '1400 rpm'], ['noise', '50 dB']] },
  { id: 'purifier', type: 'purifier', model: 'Fair AeroPure H14', cat: 'climate', price: 3450000, old: 4100000, rating: 4.94, rev: 141, likes: 374, badge: 'rec', img: u('photo-1585771724684-38269d6639fd'), specs: [['area', '65 m²'], ['filter', 'HEPA H14'], ['noise', '19 dB']] },
  { id: 'styler', type: 'styler', model: 'Fair SilkAir Pro 6-in-1', cat: 'beauty', price: 4290000, old: 5150000, rating: 4.97, rev: 289, likes: 582, badge: 'hit', img: u('photo-1522338140262-f46f5913618a'), specs: [['speed', '110 000 rpm'], ['weight', '390 g']] },
  { id: 'vacuum', type: 'vacuum', model: 'Fair Cyclone V15', cat: 'cleaning', price: 4950000, old: 6050000, rating: 4.93, rev: 196, likes: 410, badge: 'sale', img: u('photo-1527515637462-cff94eecc1ac'), specs: [['suction', '240 AW'], ['runtime', '70 min'], ['weight', '2.4 kg']] },
  { id: 'ac', type: 'ac', model: 'Fair Breeze Inverter 12', cat: 'climate', price: 5390000, old: 6200000, rating: 4.91, rev: 215, likes: 348, badge: 'rec', warranty: 36, img: u('photo-1614631446501-abcf76949eca'), specs: [['area', '38 m²'], ['noise', '21 dB'], ['power', '12 BTU']] },
  { id: 'blender', type: 'blender', model: 'Fair NutriMix 2000', cat: 'kitchen', price: 1890000, old: 2360000, rating: 4.89, rev: 118, likes: 205, badge: 'sale', img: u('photo-1570222094114-d054a817e56b'), specs: [['power', '2000 W'], ['capacity', '2.0 L'], ['speed', '32 000 rpm']] },
  { id: 'kettle', type: 'kettle', model: 'Fair ThermoGlass Wi-Fi', cat: 'kitchen', price: 790000, old: 980000, rating: 4.92, rev: 274, likes: 330, badge: 'new', img: u('photo-1594212699903-ec8a3eca50f5'), specs: [['power', '2200 W'], ['capacity', '1.7 L']] },
  { id: 'dishwasher', type: 'dishwasher', model: 'Fair AquaJet 14', cat: 'large', price: 7250000, old: 8450000, rating: 4.94, rev: 88, likes: 214, badge: 'sale', img: u('photo-1581622558663-b2e33377dfb2'), specs: [['size', '60 cm'], ['noise', '42 dB']] },
  { id: 'speaker', type: 'speaker', model: 'Fair SoundSphere 360°', cat: 'tv', price: 1650000, old: 1990000, rating: 4.9, rev: 340, likes: 476, badge: 'hit', img: u('photo-1589003077984-894e133dabab'), specs: [['power', '45 W'], ['size', '360°']] },
  { id: 'microwave', type: 'microwave', model: 'Fair SmartWave 25', cat: 'kitchen', price: 1950000, old: 2220000, rating: 4.88, rev: 112, likes: 179, badge: 'sale', img: u('photo-1585659722983-3a675dabf23d'), specs: [['capacity', '25 L'], ['power', '900 W']] },
  { id: 'steamer', type: 'steamer', model: 'Fair SteamMaster Pro', cat: 'cleaning', price: 2690000, old: 3190000, rating: 4.91, rev: 83, likes: 194, badge: 'new', img: u('photo-1545173168-9f1947eebb7f'), specs: [['pressure', '7.5 bar'], ['capacity', '1.8 L']] },
  { id: 'oven', type: 'oven', model: 'Fair ChefBake Pyrolytic', cat: 'large', price: 6450000, old: 7400000, rating: 4.95, rev: 74, likes: 238, badge: 'prem', img: u('photo-1556911220-bff31c812dba'), specs: [['capacity', '76 L'], ['size', '60 cm']] },
]
export const SWATCH = { default: ['#F8FAFC', '#CBD5E1', '#334155'] }
