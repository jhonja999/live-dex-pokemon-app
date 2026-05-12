import Image from 'next/image'

const TYPE_NAMES: Record<string, string> = {
  Normal: 'normal',
  Fighting: 'fighting',
  Flying: 'flying',
  Poison: 'poison',
  Ground: 'ground',
  Rock: 'rock',
  Bug: 'bug',
  Ghost: 'ghost',
  Steel: 'steel',
  Fire: 'fire',
  Water: 'water',
  Grass: 'grass',
  Electric: 'electric',
  Psychic: 'psychic',
  Ice: 'ice',
  Dragon: 'dragon',
  Dark: 'dark',
  Fairy: 'fairy',
}

interface TypeIconProps {
  type: string
  size?: number
  className?: string
  showLabel?: boolean
}

export default function TypeIcon({ type, size = 20, className = '', showLabel = false }: TypeIconProps) {
  const fileName = TYPE_NAMES[type]
  if (!fileName) return null

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <img
        src={`/types/${fileName}.svg`}
        alt={type}
        width={size}
        height={size}
        className="flex-shrink-0"
        style={{ width: size, height: size }}
      />
      {showLabel && <span className="text-xs font-medium">{type}</span>}
    </span>
  )
}

export function getTypeIconPath(type: string): string | null {
  const fileName = TYPE_NAMES[type]
  return fileName ? `/types/${fileName}.svg` : null
}
