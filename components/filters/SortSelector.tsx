'use client'

import { SortOption } from '@/types/ui'
import { GameType } from '@/types/game'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'dex', label: 'Pokédex #' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'perfection', label: 'Perfection %' },
  { value: 'favorite', label: 'Favorites' },
]

interface SortSelectorProps {
  value: SortOption
  onChange: (sort: SortOption) => void
  game?: GameType
}

export default function SortSelector({ value, onChange, game }: SortSelectorProps) {
  const dexLabel = game ? 'Game Pokédex' : 'Pokédex #'
  const options = game
    ? SORT_OPTIONS.map(o => o.value === 'dex' ? { ...o, label: dexLabel } : o)
    : SORT_OPTIONS

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
