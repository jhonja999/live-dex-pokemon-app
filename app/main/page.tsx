import { Suspense } from 'react'
import MainContent from './MainContent'
import { PokemonGridSkeleton } from '@/components/pokemon/PokemonSkeleton'

export default function MainPage() {
  return (
    <Suspense fallback={<PokemonGridSkeleton />}>
      <MainContent />
    </Suspense>
  )
}
