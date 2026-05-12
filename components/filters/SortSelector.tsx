'use client'

import { SortOption } from '@/types/ui'
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
}

export default function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
