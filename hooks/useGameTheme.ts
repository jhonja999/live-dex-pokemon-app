'use client'

import { useGameStore } from '@/store/gameStore'

export interface PokemonSlotTheme {
  wrapper: string
  imageContainer: string
  label: string
}

export interface GameTheme {
  container: string
  grid: string
  card: PokemonSlotTheme
  header: string
  fab: string
  skeleton: string
}

const THEMES: Record<string, GameTheme> = {
  arceus: {
    container:
      'bg-transparent border-x border-[#8b5e34]/20',
    grid: 'grid-cols-3 gap-1.5 p-2',
    card: {
      wrapper:
        'aspect-[4/5] bg-[#3d3228]/40 border border-[#8b5e34]/35 rounded-sm hover:scale-95 transition-transform hover:bg-[#4a3f35]/50',
      imageContainer:
        'relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]',
      label:
        'bg-[#8b5e34] text-[#f4ebd0] text-[8px] font-serif uppercase tracking-tight bottom-0 w-full text-center py-0.5',
    },
    header:
      'sticky top-0 z-20 backdrop-blur-sm bg-background/80 border-b border-[#8b5e34]/30 text-[#8b5e34] font-serif py-1 px-4',
    fab: 'bg-[#8b5e34] text-[#f4ebd0] border border-[#a07040] shadow-lg',
    skeleton: 'bg-[#3d3228]/30',
  },
  zeroA: {
    container:
      'bg-transparent border-x border-[#00f2ff]/10',
    grid: 'grid-cols-3 gap-1 p-2',
    card: {
      wrapper:
        'aspect-[4/5] bg-[#0a2529]/30 backdrop-blur-md border border-[#00f2ff]/30 rounded-none overflow-hidden group shadow-[inset_0_0_15px_rgba(0,242,255,0.05)] hover:bg-[#0a3540]/40',
      imageContainer:
        'scale-110 group-hover:scale-125 transition-transform duration-500 saturate-[1.2]',
      label:
        'bg-[#00f2ff] text-[#05161a] text-[9px] font-mono font-black italic bottom-0 w-full text-center py-0.5 skew-x-[-10deg]',
    },
    header:
      'sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-[#00f2ff]/40 text-[#00f2ff] font-mono py-2 uppercase tracking-[0.2em]',
    fab: 'bg-[#00f2ff] text-[#05161a] shadow-[0_0_20px_#00f2ff] animate-pulse',
    skeleton: 'bg-[#0a3540]/30',
  },
}

export function useGameTheme(): GameTheme {
  const currentGame = useGameStore((s) => s.currentGame)
  return THEMES[currentGame] || THEMES.arceus
}

export function getGameTheme(game: string | undefined): GameTheme {
  return THEMES[game || 'arceus'] || THEMES.arceus
}
