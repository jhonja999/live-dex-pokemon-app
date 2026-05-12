import { PokemonSpecies, StatName } from '@/types/pokemon'

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP',
  atk: 'Attack',
  def: 'Defense',
  spAtk: 'Sp.Atk',
  spDef: 'Sp.Def',
  spe: 'Speed',
}

interface NatureInfo {
  name: string
  increased: StatName
  decreased: StatName
}

const NATURES: NatureInfo[] = [
  { name: 'Hardy', increased: 'atk', decreased: 'atk' },
  { name: 'Lonely', increased: 'atk', decreased: 'def' },
  { name: 'Brave', increased: 'atk', decreased: 'spe' },
  { name: 'Adamant', increased: 'atk', decreased: 'spAtk' },
  { name: 'Naughty', increased: 'atk', decreased: 'spDef' },
  { name: 'Bold', increased: 'def', decreased: 'atk' },
  { name: 'Relaxed', increased: 'def', decreased: 'spe' },
  { name: 'Impish', increased: 'def', decreased: 'spAtk' },
  { name: 'Lax', increased: 'def', decreased: 'spDef' },
  { name: 'Timid', increased: 'spe', decreased: 'atk' },
  { name: 'Hasty', increased: 'spe', decreased: 'def' },
  { name: 'Jolly', increased: 'spe', decreased: 'spAtk' },
  { name: 'Naive', increased: 'spe', decreased: 'spDef' },
  { name: 'Modest', increased: 'spAtk', decreased: 'atk' },
  { name: 'Mild', increased: 'spAtk', decreased: 'def' },
  { name: 'Quiet', increased: 'spAtk', decreased: 'spe' },
  { name: 'Rash', increased: 'spAtk', decreased: 'spDef' },
  { name: 'Calm', increased: 'spDef', decreased: 'atk' },
  { name: 'Gentle', increased: 'spDef', decreased: 'def' },
  { name: 'Sassy', increased: 'spDef', decreased: 'spe' },
  { name: 'Careful', increased: 'spDef', decreased: 'spAtk' },
]

function getBaseStats(pokemon: Pick<PokemonSpecies, 'hp' | 'attack' | 'defense' | 'spAtk' | 'spDef' | 'speed'>): Record<StatName, number> {
  return {
    hp: pokemon.hp,
    atk: pokemon.attack,
    def: pokemon.defense,
    spAtk: pokemon.spAtk,
    spDef: pokemon.spDef,
    spe: pokemon.speed,
  }
}

export interface NatureRecommendation {
  name: string
  label: string
  increased: StatName
  decreased: StatName
  reasoning: string
  score: number
}

export function getBestNatures(pokemon: Pick<PokemonSpecies, 'hp' | 'attack' | 'defense' | 'spAtk' | 'spDef' | 'speed'>, count: number = 2): NatureRecommendation[] {
  const stats = getBaseStats(pokemon)

  const sorted = (Object.entries(stats) as [StatName, number][])
    .sort((a, b) => b[1] - a[1])

  const highest = sorted[0]
  const secondHighest = sorted[1]
  const lowest = sorted[sorted.length - 1]

  const candidates: { nature: NatureInfo; score: number }[] = []

  for (const nature of NATURES) {
    if (nature.increased === nature.decreased) continue

    const increasedStat = stats[nature.increased]
    const decreasedStat = stats[nature.decreased]
    const highestStat = stats[highest[0]]
    const lowestStat = stats[lowest[0]]

    let score = 0
    if (nature.increased === highest[0]) score += 50
    else if (nature.increased === secondHighest[0]) score += 30
    if (nature.decreased === lowest[0]) score += 30
    else if (nature.decreased !== highest[0]) score += 10

    if (nature.decreased === nature.increased) score = -100

    candidates.push({ nature, score })
  }

  candidates.sort((a, b) => b.score - a.score)

  return candidates.slice(0, count).map(c => ({
    name: c.nature.name,
    label: `${c.nature.name} (+${STAT_LABELS[c.nature.increased]}, -${STAT_LABELS[c.nature.decreased]})`,
    increased: c.nature.increased,
    decreased: c.nature.decreased,
    reasoning: `Boosts ${STAT_LABELS[c.nature.increased]} (${stats[c.nature.increased]}) and hinders ${STAT_LABELS[c.nature.decreased]} (${stats[c.nature.decreased]})`,
    score: c.score,
  }))
}

export function getRecommendedNature(pokemon: Pick<PokemonSpecies, 'hp' | 'attack' | 'defense' | 'spAtk' | 'spDef' | 'speed'>): NatureRecommendation {
  return getBestNatures(pokemon, 1)[0]
}

export function getTypeEffectivenessSummary(pokemon: PokemonSpecies): { strong: string[]; weak: string[]; immune: string[] } {
  const typeChart: Record<string, { strong: string[]; weak: string[]; immune: string[] }> = {
    Normal: { strong: [], weak: ['Fighting'], immune: ['Ghost'] },
    Fire: { strong: ['Grass', 'Ice', 'Bug', 'Steel'], weak: ['Water', 'Ground', 'Rock'], immune: [] },
    Water: { strong: ['Fire', 'Ground', 'Rock'], weak: ['Electric', 'Grass'], immune: [] },
    Electric: { strong: ['Water', 'Flying'], weak: ['Ground'], immune: [] },
    Grass: { strong: ['Water', 'Ground', 'Rock'], weak: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'], immune: [] },
    Ice: { strong: ['Grass', 'Ground', 'Flying', 'Dragon'], weak: ['Fire', 'Fighting', 'Rock', 'Steel'], immune: [] },
    Fighting: { strong: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], weak: ['Flying', 'Psychic', 'Fairy'], immune: [] },
    Poison: { strong: ['Grass', 'Fairy'], weak: ['Ground', 'Psychic'], immune: [] },
    Ground: { strong: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], weak: ['Water', 'Grass', 'Ice'], immune: ['Electric'] },
    Flying: { strong: ['Grass', 'Fighting', 'Bug'], weak: ['Electric', 'Ice', 'Rock'], immune: ['Ground'] },
    Psychic: { strong: ['Fighting', 'Poison'], weak: ['Bug', 'Ghost', 'Dark'], immune: [] },
    Bug: { strong: ['Grass', 'Psychic', 'Dark'], weak: ['Fire', 'Flying', 'Rock'], immune: [] },
    Rock: { strong: ['Fire', 'Ice', 'Flying', 'Bug'], weak: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'], immune: [] },
    Ghost: { strong: ['Psychic', 'Ghost'], weak: ['Ghost', 'Dark'], immune: ['Normal', 'Fighting'] },
    Dragon: { strong: ['Dragon'], weak: ['Ice', 'Dragon', 'Fairy'], immune: [] },
    Dark: { strong: ['Psychic', 'Ghost'], weak: ['Fighting', 'Bug', 'Fairy'], immune: ['Psychic'] },
    Steel: { strong: ['Ice', 'Rock', 'Fairy'], weak: ['Fire', 'Fighting', 'Ground'], immune: ['Poison'] },
    Fairy: { strong: ['Fighting', 'Dragon', 'Dark'], weak: ['Poison', 'Steel'], immune: ['Dragon'] },
  }

  const type1 = typeChart[pokemon.type1] ?? { strong: [], weak: [], immune: [] }
  const type2 = pokemon.type2 ? (typeChart[pokemon.type2] ?? { strong: [], weak: [], immune: [] }) : null

  const combined: { strong: string[]; weak: string[]; immune: string[] } = {
    strong: [...type1.strong],
    weak: [...type1.weak],
    immune: [...type1.immune],
  }

  if (type2) {
    combined.strong = combined.strong.filter(t => !type2.weak.includes(t) && !type2.immune.includes(t))
    combined.weak = combined.weak.filter(t => !type2.strong.includes(t) && !type2.immune.includes(t))
    combined.immune = [...new Set([...combined.immune, ...type2.immune])]
  }

  return {
    strong: [...new Set(combined.strong)],
    weak: [...new Set(combined.weak)],
    immune: [...new Set(combined.immune)],
  }
}
