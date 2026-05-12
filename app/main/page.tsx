import { Suspense } from 'react'
import MainContent from './MainContent'

export default function MainPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="space-y-3">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
          <p className="text-muted-foreground">Loading Pokémon data...</p>
        </div>
      </div>
    }>
      <MainContent />
    </Suspense>
  )
}
