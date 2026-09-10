export interface ServerLogoPreset {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
}

// Crisp, high-contrast SVG Data URIs representing iconic Minecraft server logos
export const PRESET_SERVER_LOGOS: ServerLogoPreset[] = [
  {
    id: 'creeper',
    name: 'Creeper Face',
    category: 'Mobs',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%231b5e20"/><rect x="8" y="8" width="48" height="48" fill="%232e7d32"/><rect x="16" y="16" width="10" height="10" fill="%230f2f13"/><rect x="38" y="16" width="10" height="10" fill="%230f2f13"/><rect x="26" y="26" width="12" height="18" fill="%230f2f13"/><rect x="20" y="32" width="24" height="12" fill="%230f2f13"/><rect x="20" y="44" width="8" height="8" fill="%230f2f13"/><rect x="36" y="44" width="8" height="8" fill="%230f2f13"/></svg>`
  },
  {
    id: 'diamond-sword',
    name: 'Diamond Sword',
    category: 'Combat',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%230f172a"/><path d="M48 6h10v10h-4v4h-4v4h-4v4h-4v4h-4v4h-4v4h-4v-4h4v-4h4v-4h4v-4h4v-4h4v-4h-2V6z" fill="%2338bdf8"/><path d="M50 8h6v6h-4v4h-4v4h-4v4h-4v4h-4v4h-4v-2h2v-4h4v-4h4v-4h4v-4h4v-4h-2V8z" fill="%23e0f2fe"/><path d="M22 42h4v4h-4zM16 48h6v6h-6zM8 52h4v4H8z" fill="%2378350f"/><path d="M12 48h4v4h-4z" fill="%230284c7"/><path d="M6 56h6v6H6z" fill="%23b45309"/></svg>`
  },
  {
    id: 'golden-apple',
    name: 'Enchanted Golden Apple',
    category: 'Items',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%231e1b4b"/><rect x="28" y="10" width="8" height="10" fill="%2378350f"/><rect x="18" y="18" width="28" height="34" rx="8" fill="%23f59e0b"/><rect x="22" y="22" width="8" height="12" rx="2" fill="%23fef3c7"/><circle cx="32" cy="36" r="16" fill="%23fbbf24" opacity="0.6"/><path d="M20 28 Q32 20 44 28 Q44 50 32 54 Q20 50 20 28" fill="%23f59e0b"/><circle cx="26" cy="26" r="3" fill="%23ffffff"/></svg>`
  },
  {
    id: 'netherite-helmet',
    name: 'Netherite Helmet',
    category: 'Armor',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%2318181b"/><rect x="14" y="14" width="36" height="36" rx="4" fill="%233f3f46"/><rect x="18" y="18" width="28" height="18" fill="%2327272a"/><rect x="16" y="38" width="10" height="16" fill="%2327272a"/><rect x="38" y="38" width="10" height="16" fill="%2327272a"/><rect x="24" y="24" width="16" height="8" fill="%23a1a1aa"/><rect x="22" y="44" width="20" height="6" fill="%2352525b"/></svg>`
  },
  {
    id: 'ender-eye',
    name: 'Eye of Ender',
    category: 'Magic',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%23022c22"/><circle cx="32" cy="32" r="22" fill="%23064e3b"/><circle cx="32" cy="32" r="17" fill="%23059669"/><ellipse cx="32" cy="32" rx="4" ry="12" fill="%23dc2626"/><ellipse cx="32" cy="32" rx="2" ry="8" fill="%23991b1b"/><circle cx="27" cy="24" r="3" fill="%23a7f3d0"/></svg>`
  },
  {
    id: 'nether-portal',
    name: 'Nether Portal',
    category: 'Dimensions',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%2309090b"/><rect x="12" y="8" width="40" height="48" fill="%231e1b4b"/><rect x="16" y="12" width="32" height="40" fill="%23030712"/><rect x="20" y="16" width="24" height="32" fill="%239333ea"/><rect x="24" y="20" width="16" height="24" fill="%23c084fc"/><rect x="28" y="24" width="8" height="16" fill="%23e879f9"/></svg>`
  },
  {
    id: 'redstone-block',
    name: 'Redstone Block',
    category: 'Tech',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%23450a0a"/><rect x="8" y="8" width="48" height="48" fill="%23dc2626"/><rect x="14" y="14" width="10" height="10" fill="%23ef4444"/><rect x="28" y="20" width="12" height="12" fill="%23f87171"/><rect x="18" y="34" width="14" height="14" fill="%23991b1b"/><rect x="36" y="36" width="14" height="14" fill="%23ef4444"/><circle cx="32" cy="26" r="3" fill="%23fef2f2"/></svg>`
  },
  {
    id: 'emerald',
    name: 'Emerald Gem',
    category: 'Economy',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%23022c22"/><polygon points="32,8 52,24 52,44 32,56 12,44 12,24" fill="%23059669"/><polygon points="32,14 46,26 46,42 32,50 18,42 18,26" fill="%2310b981"/><polygon points="32,20 40,28 32,44 24,28" fill="%236ee7b7"/><circle cx="26" cy="22" r="3" fill="%23ecfdf5"/></svg>`
  },
  {
    id: 'totem',
    name: 'Totem of Undying',
    category: 'Magic',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%231c1917"/><rect x="22" y="10" width="20" height="16" fill="%23fbbf24"/><circle cx="27" cy="18" r="2.5" fill="%2310b981"/><circle cx="37" cy="18" r="2.5" fill="%2310b981"/><rect x="14" y="24" width="36" height="10" fill="%23f59e0b"/><rect x="24" y="32" width="16" height="22" fill="%23d97706"/><rect x="20" y="50" width="24" height="6" fill="%23fbbf24"/></svg>`
  },
  {
    id: 'grass-block',
    name: 'Classic Grass Block',
    category: 'World',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%231c1917"/><rect x="8" y="8" width="48" height="48" fill="%2378350f"/><rect x="8" y="8" width="48" height="18" fill="%2316a34a"/><path d="M8 26 L14 26 L14 32 L20 32 L20 26 L26 26 L26 30 L32 30 L32 26 L38 26 L38 34 L44 34 L44 26 L50 26 L50 30 L56 30 L56 26" fill="%2316a34a"/><rect x="12" y="38" width="8" height="8" fill="%23572207"/><rect x="36" y="42" width="10" height="8" fill="%23572207"/><rect x="26" y="34" width="6" height="6" fill="%239a3412"/></svg>`
  },
  {
    id: 'tnt',
    name: 'TNT Explosive',
    category: 'Items',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="%231e293b"/><rect x="8" y="8" width="48" height="48" fill="%23dc2626"/><rect x="8" y="22" width="48" height="20" fill="%23f8fafc"/><text x="32" y="37" font-family="monospace" font-weight="900" font-size="16" text-anchor="middle" fill="%230f172a">TNT</text><rect x="10" y="10" width="44" height="4" fill="%23991b1b"/><rect x="10" y="50" width="44" height="4" fill="%23991b1b"/></svg>`
  }
];

export const DEFAULT_SERVER_LOGO = PRESET_SERVER_LOGOS[0].dataUrl;
