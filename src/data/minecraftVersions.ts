export interface MinecraftVersionInfo {
  version: string;
  era: string;
  name?: string;
  releaseYear: string;
  tag?: string;
  recommended?: boolean;
  type: 'release' | 'snapshot' | 'legacy';
}

export const MINECRAFT_ERAS = [
  'All',
  '1.21 Tricky Trials',
  '1.20 Trails & Tales',
  '1.19 The Wild Update',
  '1.18 Caves & Cliffs II',
  '1.17 Caves & Cliffs I',
  '1.16 Nether Update',
  '1.15 Buzzy Bees',
  '1.14 Village & Pillage',
  '1.13 Update Aquatic',
  '1.12 World of Color',
  '1.11 Exploration',
  '1.10 Frostburn',
  '1.9 Combat Update',
  '1.8 Bountiful / PvP Era',
  '1.7 World Update',
  'Legacy & Classic (1.6 - Beta)'
] as const;

export const ALL_MINECRAFT_VERSIONS: MinecraftVersionInfo[] = [
  // 1.21 Tricky Trials
  { version: '1.21.4', era: '1.21 Tricky Trials', name: 'Tricky Trials (Winter Drop)', releaseYear: '2024', tag: 'Latest Release', recommended: true, type: 'release' },
  { version: '1.21.3', era: '1.21 Tricky Trials', name: 'Tricky Trials Update', releaseYear: '2024', type: 'release' },
  { version: '1.21.2', era: '1.21 Tricky Trials', name: 'Bundles of Bravery', releaseYear: '2024', type: 'release' },
  { version: '1.21.1', era: '1.21 Tricky Trials', name: 'Tricky Trials Hotfix', releaseYear: '2024', tag: 'High Stability', recommended: true, type: 'release' },
  { version: '1.21', era: '1.21 Tricky Trials', name: 'Tricky Trials Major', releaseYear: '2024', type: 'release' },

  // 1.20 Trails & Tales
  { version: '1.20.6', era: '1.20 Trails & Tales', name: 'Armadillo & Wolf Armor', releaseYear: '2024', tag: 'Stable', type: 'release' },
  { version: '1.20.5', era: '1.20 Trails & Tales', name: 'Armored Paws', releaseYear: '2024', type: 'release' },
  { version: '1.20.4', era: '1.20 Trails & Tales', name: 'Trails & Tales Polished', releaseYear: '2023', tag: 'SMP Popular', recommended: true, type: 'release' },
  { version: '1.20.3', era: '1.20 Trails & Tales', name: 'Decorated Pots & Shields', releaseYear: '2023', type: 'release' },
  { version: '1.20.2', era: '1.20 Trails & Tales', name: 'Network Protocol Refactor', releaseYear: '2023', type: 'release' },
  { version: '1.20.1', era: '1.20 Trails & Tales', name: 'Modded Standard 1.20', releaseYear: '2023', tag: 'Best for Mods', recommended: true, type: 'release' },
  { version: '1.20', era: '1.20 Trails & Tales', name: 'Trails & Tales Major', releaseYear: '2023', type: 'release' },

  // 1.19 The Wild Update
  { version: '1.19.4', era: '1.19 The Wild Update', name: 'Deep Dark & Wardens', releaseYear: '2023', tag: 'Recommended', recommended: true, type: 'release' },
  { version: '1.19.3', era: '1.19 The Wild Update', name: 'Vex Model Overhaul', releaseYear: '2022', type: 'release' },
  { version: '1.19.2', era: '1.19 The Wild Update', name: 'Wild Update Hotfix', releaseYear: '2022', tag: 'Modded Hub', type: 'release' },
  { version: '1.19.1', era: '1.19 The Wild Update', name: 'Allay Duplication', releaseYear: '2022', type: 'release' },
  { version: '1.19', era: '1.19 The Wild Update', name: 'The Wild Update Initial', releaseYear: '2022', type: 'release' },

  // 1.18 Caves & Cliffs II
  { version: '1.18.2', era: '1.18 Caves & Cliffs II', name: 'New World Gen Final', releaseYear: '2022', tag: 'Stable Gen', recommended: true, type: 'release' },
  { version: '1.18.1', era: '1.18 Caves & Cliffs II', name: 'Caves & Cliffs II Hotfix', releaseYear: '2021', type: 'release' },
  { version: '1.18', era: '1.18 Caves & Cliffs II', name: 'Caves & Cliffs Part II', releaseYear: '2021', type: 'release' },

  // 1.17 Caves & Cliffs I
  { version: '1.17.1', era: '1.17 Caves & Cliffs I', name: 'Amethyst & Axolotls', releaseYear: '2021', tag: 'Stable', recommended: true, type: 'release' },
  { version: '1.17', era: '1.17 Caves & Cliffs I', name: 'Caves & Cliffs Part I', releaseYear: '2021', type: 'release' },

  // 1.16 Nether Update
  { version: '1.16.5', era: '1.16 Nether Update', name: 'Nether Update Final', releaseYear: '2021', tag: 'Legendary Stability', recommended: true, type: 'release' },
  { version: '1.16.4', era: '1.16 Nether Update', name: 'Piglin Brutes', releaseYear: '2020', type: 'release' },
  { version: '1.16.3', era: '1.16 Nether Update', name: 'Nether Fixes', releaseYear: '2020', type: 'release' },
  { version: '1.16.2', era: '1.16 Nether Update', name: 'Bastion Remnants', releaseYear: '2020', type: 'release' },
  { version: '1.16.1', era: '1.16 Nether Update', name: 'Speedrun Preferred', releaseYear: '2020', tag: 'Speedrunning', type: 'release' },
  { version: '1.16', era: '1.16 Nether Update', name: 'The Nether Overhaul', releaseYear: '2020', type: 'release' },

  // 1.15 Buzzy Bees
  { version: '1.15.2', era: '1.15 Buzzy Bees', name: 'Buzzy Bees Stable', releaseYear: '2020', tag: 'Stable', type: 'release' },
  { version: '1.15.1', era: '1.15 Buzzy Bees', name: 'Honey & Bees Hotfix', releaseYear: '2019', type: 'release' },
  { version: '1.15', era: '1.15 Buzzy Bees', name: 'Buzzy Bees Major', releaseYear: '2019', type: 'release' },

  // 1.14 Village & Pillage
  { version: '1.14.4', era: '1.14 Village & Pillage', name: 'Raids & Villager Overhaul', releaseYear: '2019', tag: 'Stable', recommended: true, type: 'release' },
  { version: '1.14.3', era: '1.14 Village & Pillage', name: 'Villager Trading Fix', releaseYear: '2019', type: 'release' },
  { version: '1.14.2', era: '1.14 Village & Pillage', name: 'Village & Pillage Hotfix', releaseYear: '2019', type: 'release' },
  { version: '1.14.1', era: '1.14 Village & Pillage', name: 'Chunk Loading Patches', releaseYear: '2019', type: 'release' },
  { version: '1.14', era: '1.14 Village & Pillage', name: 'Village & Pillage Release', releaseYear: '2019', type: 'release' },

  // 1.13 Update Aquatic
  { version: '1.13.2', era: '1.13 Update Aquatic', name: 'Oceans & Corals', releaseYear: '2018', tag: 'The Flattening', type: 'release' },
  { version: '1.13.1', era: '1.13 Update Aquatic', name: 'Ocean Performance', releaseYear: '2018', type: 'release' },
  { version: '1.13', era: '1.13 Update Aquatic', name: 'Update Aquatic Major', releaseYear: '2018', type: 'release' },

  // 1.12 World of Color
  { version: '1.12.2', era: '1.12 World of Color', name: 'Golden Era of Modpacks', releaseYear: '2017', tag: 'Modpack King', recommended: true, type: 'release' },
  { version: '1.12.1', era: '1.12 World of Color', name: 'Concrete & Glazed Terracotta', releaseYear: '2017', type: 'release' },
  { version: '1.12', era: '1.12 World of Color', name: 'World of Color Release', releaseYear: '2017', type: 'release' },

  // 1.11 Exploration Update
  { version: '1.11.2', era: '1.11 Exploration', name: 'Woodland Mansions & Totems', releaseYear: '2016', tag: 'Stable', type: 'release' },
  { version: '1.11', era: '1.11 Exploration', name: 'The Exploration Update', releaseYear: '2016', type: 'release' },

  // 1.10 Frostburn Update
  { version: '1.10.2', era: '1.10 Frostburn', name: 'Strays, Husks & Polar Bears', releaseYear: '2016', tag: 'Stable', type: 'release' },
  { version: '1.10', era: '1.10 Frostburn', name: 'Frostburn Update', releaseYear: '2016', type: 'release' },

  // 1.9 Combat Update
  { version: '1.9.4', era: '1.9 Combat Update', name: 'Elytra & Off-hand Combat', releaseYear: '2016', tag: 'Stable', type: 'release' },
  { version: '1.9.2', era: '1.9 Combat Update', name: 'The End Islands', releaseYear: '2016', type: 'release' },
  { version: '1.9', era: '1.9 Combat Update', name: 'Combat Update Major', releaseYear: '2016', type: 'release' },

  // 1.8 Bountiful / PvP Era
  { version: '1.8.9', era: '1.8 Bountiful / PvP Era', name: 'Competitive PvP & Hypixel Classic', releaseYear: '2015', tag: 'PvP Standard', recommended: true, type: 'release' },
  { version: '1.8.8', era: '1.8 Bountiful / PvP Era', name: 'Security & Guardian Patches', releaseYear: '2015', type: 'release' },
  { version: '1.8.7', era: '1.8 Bountiful / PvP Era', name: 'Security Fixes', releaseYear: '2015', type: 'release' },
  { version: '1.8.3', era: '1.8 Bountiful / PvP Era', name: 'Ocean Monuments', releaseYear: '2015', type: 'release' },
  { version: '1.8', era: '1.8 Bountiful / PvP Era', name: 'The Bountiful Update', releaseYear: '2014', type: 'release' },

  // 1.7 World Update
  { version: '1.7.10', era: '1.7 World Update', name: 'Historic Modding Legend', releaseYear: '2014', tag: 'Classic Forge', recommended: true, type: 'release' },
  { version: '1.7.9', era: '1.7 World Update', name: 'Skin Support & UUIDs', releaseYear: '2014', type: 'release' },
  { version: '1.7.5', era: '1.7 World Update', name: 'Mini-Game Realms', releaseYear: '2014', type: 'release' },
  { version: '1.7.2', era: '1.7 World Update', name: 'Update that Changed the World', releaseYear: '2013', type: 'release' },

  // Legacy & Classic (1.6 - Beta)
  { version: '1.6.4', era: 'Legacy & Classic (1.6 - Beta)', name: 'The Horse Update', releaseYear: '2013', tag: 'Legacy', type: 'legacy' },
  { version: '1.5.2', era: 'Legacy & Classic (1.6 - Beta)', name: 'The Redstone Update', releaseYear: '2013', tag: 'Classic Redstone', type: 'legacy' },
  { version: '1.4.7', era: 'Legacy & Classic (1.6 - Beta)', name: 'Pretty Scary Update', releaseYear: '2013', tag: 'Wither Boss', type: 'legacy' },
  { version: '1.2.5', era: 'Legacy & Classic (1.6 - Beta)', name: 'Tekkit Classic Era', releaseYear: '2012', tag: 'Tekkit Legend', type: 'legacy' },
  { version: 'b1.7.3', era: 'Legacy & Classic (1.6 - Beta)', name: 'Beta 1.7.3 Golden Age', releaseYear: '2011', tag: 'Beta Nostalgia', type: 'legacy' },
];

export const POPULAR_VERSION_SHORTCUTS = [
  '1.21.4',
  '1.21.1',
  '1.20.4',
  '1.20.1',
  '1.19.4',
  '1.18.2',
  '1.16.5',
  '1.12.2',
  '1.8.9',
  '1.7.10',
];
