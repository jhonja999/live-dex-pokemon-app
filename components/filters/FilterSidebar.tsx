'use client'

import { FilterState, SortOption } from '@/types/ui'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const POKEMON_TYPES = [
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
]

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
}

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  return (
    <div className="space-y-6 bg-surface border border-border rounded-lg p-4">
      <div>
        <h3 className="font-bold mb-3 text-foreground">Status</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="captured"
              checked={filters.captured === true}
              onCheckedChange={() =>
                onFilterChange('captured', filters.captured === true ? null : true)
              }
            />
            <Label htmlFor="captured" className="text-sm cursor-pointer">
              Captured
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="uncaptured"
              checked={filters.captured === false}
              onCheckedChange={() =>
                onFilterChange('captured', filters.captured === false ? null : false)
              }
            />
            <Label htmlFor="uncaptured" className="text-sm cursor-pointer">
              Uncaptured
            </Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3 text-foreground">Special</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="shiny"
              checked={filters.shiny}
              onCheckedChange={() => onFilterChange('shiny', !filters.shiny)}
            />
            <Label htmlFor="shiny" className="text-sm cursor-pointer">
              Shiny
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="alpha"
              checked={filters.alpha}
              onCheckedChange={() => onFilterChange('alpha', !filters.alpha)}
            />
            <Label htmlFor="alpha" className="text-sm cursor-pointer">
              Alpha
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="favorite"
              checked={filters.favorite}
              onCheckedChange={() => onFilterChange('favorite', !filters.favorite)}
            />
            <Label htmlFor="favorite" className="text-sm cursor-pointer">
              Favorite
            </Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3 text-foreground">Types</h3>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {POKEMON_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.types.includes(type as any)}
                onCheckedChange={() => {
                  const newTypes = filters.types.includes(type as any)
                    ? filters.types.filter((t) => t !== type)
                    : [...filters.types, type as any]
                  onFilterChange('types', newTypes)
                }}
              />
              <Label htmlFor={`type-${type}`} className="text-xs cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onFilterChange('types', [])
          onFilterChange('captured', null)
          onFilterChange('shiny', false)
          onFilterChange('alpha', false)
          onFilterChange('favorite', false)
        }}
      >
        Clear Filters
      </Button>
    </div>
  )
}
