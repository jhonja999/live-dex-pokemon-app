'use client'

import { memo } from 'react'

interface PokemonSkeletonProps {
  colorClass?: string
}

function PokemonSkeletonComponent({ colorClass = 'bg-secondary/20' }: PokemonSkeletonProps) {
  return (
    <div className="aspect-[4/5] border border-border/30 rounded-lg overflow-hidden bg-surface animate-pulse flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`w-full h-full rounded-md ${colorClass}`} />
      </div>
      <div className={`h-5 ${colorClass} w-full flex-shrink-0`} />
    </div>
  )
}

export default memo(PokemonSkeletonComponent)

export function PokemonGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <PokemonSkeletonComponent key={i} />
      ))}
    </div>
  )
}
