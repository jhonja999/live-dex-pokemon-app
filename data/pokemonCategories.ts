import { GameType } from '@/types/game'

export type PokemonTag =
  | 'starter'
  | 'trade-evolution'
  | 'legendary'
  | 'mythical'
  | 'gift-pokemon'
  | 'npc-trade'
  | 'version-exclusive'
  | 'regional-form'
  | 'mega-evolution'
  | 'distortion-exclusive'
  | 'post-game'

export interface TagInfo {
  label: string
  description: string
  icon: string
}

export const TAG_INFO: Record<PokemonTag, TagInfo> = {
  starter: { label: 'Starter', description: 'Starter Pokémon and their evolutions', icon: '🥚' },
  'trade-evolution': { label: 'Trade Evolution', description: 'Evolves via trading', icon: '🔄' },
  legendary: { label: 'Legendary', description: 'Legendary Pokémon', icon: '⭐' },
  mythical: { label: 'Mythical', description: 'Mythical Pokémon (event-only)', icon: '🌟' },
  'gift-pokemon': { label: 'Gift Pokémon', description: 'Received as a gift in-game', icon: '🎁' },
  'npc-trade': { label: 'NPC Trade', description: 'Available via in-game trade', icon: '🤝' },
  'version-exclusive': { label: 'Version Exclusive', description: 'Only in one version of the game', icon: '🔶' },
  'regional-form': { label: 'Regional Form', description: 'Has a regional variant', icon: '🌍' },
  'mega-evolution': { label: 'Mega Evolution', description: 'Can Mega Evolve', icon: '💎' },
  'distortion-exclusive': { label: 'Space-Time Distortion', description: 'Only found in space-time distortions', icon: '🌀' },
  'post-game': { label: 'Post-Game', description: 'Only available after the main story', icon: '🏆' },
}

const STARTERS: PokemonTag = 'starter'

export interface DexSection {
  key: string
  label: string
  tags: PokemonTag[]
  priority: number
}

export const GAME_SECTIONS: Record<GameType, DexSection[]> = {
  arceus: [
    { key: 'starters', label: 'Starters', tags: ['starter'], priority: 1 },
    { key: 'trade-evolutions', label: 'Trade Evolutions', tags: ['trade-evolution'], priority: 2 },
    { key: 'regional-forms', label: 'Hisuian Forms', tags: ['regional-form'], priority: 3 },
    { key: 'distortion', label: 'Space-Time Distortions', tags: ['distortion-exclusive'], priority: 4 },
    { key: 'gift', label: 'Gift & NPC Trades', tags: ['gift-pokemon', 'npc-trade'], priority: 5 },
    { key: 'legendary', label: 'Legendary & Mythical', tags: ['legendary', 'mythical'], priority: 6 },
    { key: 'other', label: 'Other Pokémon', tags: [], priority: 99 },
  ],
  zeroA: [
    { key: 'starters', label: 'Starters', tags: ['starter'], priority: 1 },
    { key: 'trade-evolutions', label: 'Trade Evolutions', tags: ['trade-evolution'], priority: 2 },
    { key: 'mega-evolutions', label: 'Mega Evolutions', tags: ['mega-evolution'], priority: 3 },
    { key: 'regional-forms', label: 'Regional Forms', tags: ['regional-form'], priority: 4 },
    { key: 'gift', label: 'Gift & NPC Trades', tags: ['gift-pokemon', 'npc-trade'], priority: 5 },
    { key: 'legendary', label: 'Legendary & Mythical', tags: ['legendary', 'mythical'], priority: 6 },
    { key: 'other', label: 'Other Pokémon', tags: [], priority: 99 },
  ],
}

export const GAME_POKEMON_TAGS: Record<GameType, Record<number, PokemonTag[]>> = {
  arceus: {
    // Starters (with regional form for final evos)
    722: [STARTERS], 723: [STARTERS], 724: [STARTERS, 'regional-form'],
    155: [STARTERS], 156: [STARTERS], 157: [STARTERS, 'regional-form'],
    501: [STARTERS], 502: [STARTERS], 503: [STARTERS, 'regional-form'],

    // Trade evolutions
    63: ['trade-evolution'], 64: ['trade-evolution'], 65: ['trade-evolution'],
    66: ['trade-evolution'], 67: ['trade-evolution'], 68: ['trade-evolution'],
    74: ['trade-evolution'], 75: ['trade-evolution'], 76: ['trade-evolution'],
    92: ['trade-evolution'], 93: ['trade-evolution'], 94: ['trade-evolution'],
    112: ['trade-evolution'], 464: ['trade-evolution'],
    123: ['trade-evolution'], 212: ['trade-evolution'],
    125: ['trade-evolution'], 466: ['trade-evolution'],
    126: ['trade-evolution'], 467: ['trade-evolution'],
    137: ['trade-evolution'], 233: ['trade-evolution'], 474: ['trade-evolution'],
    356: ['trade-evolution'], 477: ['trade-evolution'],
    95: ['trade-evolution'], 208: ['trade-evolution'],
    117: ['trade-evolution'], 230: ['trade-evolution'],
    349: ['trade-evolution'], 350: ['trade-evolution'],

    // Hisuian forms
    58: ['regional-form'], 59: ['regional-form'],
    100: ['regional-form'], 101: ['regional-form'],
    128: ['regional-form'],
    215: ['regional-form'], 461: ['regional-form'],
    549: ['regional-form'],
    570: ['regional-form'], 571: ['regional-form'],
    628: ['regional-form'],
    704: ['regional-form'], 705: ['regional-form'], 706: ['regional-form'],
    713: ['regional-form'],

    // Space-time distortion exclusives
    443: ['distortion-exclusive'], 444: ['distortion-exclusive'], 445: ['distortion-exclusive'],
    147: ['distortion-exclusive'], 148: ['distortion-exclusive'], 149: ['distortion-exclusive'],
    410: ['distortion-exclusive'], 411: ['distortion-exclusive'],
    442: ['distortion-exclusive'],

    // Gift & NPC Trades
    129: ['gift-pokemon'],
    113: ['npc-trade'],
    122: ['npc-trade'],
    143: ['npc-trade'],
    185: ['npc-trade'],

    // Legendary
    144: ['legendary'], 145: ['legendary'], 146: ['legendary'],
    243: ['legendary'], 244: ['legendary'], 245: ['legendary'],
    377: ['legendary'], 378: ['legendary'], 379: ['legendary'],
    380: ['legendary'], 381: ['legendary'],
    382: ['legendary'], 383: ['legendary'], 384: ['legendary'],
    480: ['legendary'], 481: ['legendary'], 482: ['legendary'],
    483: ['legendary', 'distortion-exclusive'],
    484: ['legendary', 'distortion-exclusive'],
    487: ['legendary', 'distortion-exclusive'],
    488: ['legendary'],
    638: ['legendary'], 639: ['legendary'], 640: ['legendary'],
    641: ['legendary'], 642: ['legendary'], 645: ['legendary'],
    643: ['legendary'], 644: ['legendary'], 646: ['legendary'],
    716: ['legendary'], 717: ['legendary'], 718: ['legendary'],
    772: ['legendary'], 773: ['legendary'],
    785: ['legendary'], 786: ['legendary'], 787: ['legendary'], 788: ['legendary'],
    791: ['legendary'], 792: ['legendary'],
    800: ['legendary'],
    888: ['legendary'], 889: ['legendary'], 890: ['legendary'],

    // Mythical
    150: ['mythical'], 151: ['mythical'],
    251: ['mythical'],
    385: ['mythical'],
    386: ['mythical'],
    489: ['mythical'], 490: ['mythical'],
    491: ['mythical'], 492: ['mythical'], 493: ['mythical'],
    494: ['mythical'],
    647: ['mythical'], 648: ['mythical'],
    649: ['mythical'],
    719: ['mythical'],
    720: ['mythical'], 721: ['mythical'],
    801: ['mythical'], 802: ['mythical'],
  },
  zeroA: {
    // Starters
    650: [STARTERS], 651: [STARTERS], 652: [STARTERS],
    653: [STARTERS], 654: [STARTERS], 655: [STARTERS],
    656: [STARTERS], 657: [STARTERS], 658: [STARTERS],

    // Trade evolutions (note: some also have Mega Evolutions)
    63: ['trade-evolution'], 64: ['trade-evolution'],
    65: ['trade-evolution', 'mega-evolution'],
    66: ['trade-evolution'], 67: ['trade-evolution'], 68: ['trade-evolution'],
    74: ['trade-evolution'], 75: ['trade-evolution'], 76: ['trade-evolution'],
    92: ['trade-evolution'], 93: ['trade-evolution'],
    94: ['trade-evolution', 'mega-evolution'],
    524: ['trade-evolution'], 525: ['trade-evolution'], 526: ['trade-evolution'],
    532: ['trade-evolution'], 533: ['trade-evolution'], 534: ['trade-evolution'],
    588: ['trade-evolution'], 589: ['trade-evolution'],
    616: ['trade-evolution'], 617: ['trade-evolution'],
    682: ['trade-evolution'], 683: ['trade-evolution'],
    684: ['trade-evolution'], 685: ['trade-evolution'],
    708: ['trade-evolution'], 709: ['trade-evolution'],
    710: ['trade-evolution'], 711: ['trade-evolution'],
    349: ['trade-evolution'], 350: ['trade-evolution'],
    117: ['trade-evolution'], 230: ['trade-evolution'],
    79: ['trade-evolution'], 199: ['trade-evolution'],
    95: ['trade-evolution'],
    208: ['trade-evolution', 'mega-evolution'],
    123: ['trade-evolution'],
    212: ['trade-evolution', 'mega-evolution'],
    125: ['trade-evolution'], 466: ['trade-evolution'],
    126: ['trade-evolution'], 467: ['trade-evolution'],
    112: ['trade-evolution'], 464: ['trade-evolution'],
    356: ['trade-evolution'], 477: ['trade-evolution'],
    137: ['trade-evolution'], 233: ['trade-evolution'], 474: ['trade-evolution'],

    // Mega Evolutions (those not already in trade evolutions)
    3: ['mega-evolution'], 6: ['mega-evolution'], 9: ['mega-evolution'],
    80: ['mega-evolution'],
    115: ['mega-evolution'],
    127: ['mega-evolution'], 130: ['mega-evolution'],
    142: ['mega-evolution'], 150: ['mega-evolution'],
    181: ['mega-evolution'],
    214: ['mega-evolution'],
    229: ['mega-evolution'], 248: ['mega-evolution'],
    254: ['mega-evolution'], 257: ['mega-evolution'],
    260: ['mega-evolution'], 282: ['mega-evolution'],
    302: ['mega-evolution'], 303: ['mega-evolution'],
    306: ['mega-evolution'], 308: ['mega-evolution'],
    310: ['mega-evolution'], 319: ['mega-evolution'],
    323: ['mega-evolution'], 334: ['mega-evolution'],
    354: ['mega-evolution'], 359: ['mega-evolution'],
    362: ['mega-evolution'], 373: ['mega-evolution'],
    376: ['mega-evolution'], 380: ['mega-evolution'],
    381: ['mega-evolution'], 382: ['mega-evolution'],
    383: ['mega-evolution'], 384: ['mega-evolution'],
    428: ['mega-evolution'], 445: ['mega-evolution'],
    448: ['mega-evolution'], 460: ['mega-evolution'],
    475: ['mega-evolution'], 531: ['mega-evolution'],
    689: ['mega-evolution'],

    // Gift & NPC Trades
    25: ['gift-pokemon'],
    133: ['gift-pokemon'],
    143: ['npc-trade'],
    122: ['npc-trade'],
    185: ['npc-trade'],

    // Legendary & Mythical
    144: ['legendary'], 145: ['legendary'], 146: ['legendary'],
    243: ['legendary'], 244: ['legendary'], 245: ['legendary'],
    377: ['legendary'], 378: ['legendary'], 379: ['legendary'],
    480: ['legendary'], 481: ['legendary'], 482: ['legendary'],
    483: ['legendary'], 484: ['legendary'],
    488: ['legendary'], 638: ['legendary'], 639: ['legendary'], 640: ['legendary'],
    641: ['legendary'], 642: ['legendary'], 645: ['legendary'],
    643: ['legendary'], 644: ['legendary'], 646: ['legendary'],
    716: ['legendary'], 717: ['legendary'], 718: ['legendary'],
    719: ['mythical'],
    720: ['mythical'], 721: ['mythical'],
  },
}

export function getPokemonTags(game: GameType, speciesId: number): PokemonTag[] {
  return GAME_POKEMON_TAGS[game]?.[speciesId] ?? []
}

export function getSectionForPokemon(
  game: GameType,
  speciesId: number,
): string {
  const tags = getPokemonTags(game, speciesId)
  const sections = GAME_SECTIONS[game]

  for (const section of sections) {
    if (section.tags.length === 0) continue
    if (tags.some(t => section.tags.includes(t))) {
      return section.key
    }
  }

  return 'other'
}
