'use client'

import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { ANIMATION_DURATION } from '@/lib/designTokens'

interface SearchBarProps {
  value: string
  onChange: (query: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  // Debounce the onChange call
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue)
    }, ANIMATION_DURATION.normal)

    return () => clearTimeout(timer)
  }, [inputValue, onChange])

  return (
    <Input
      placeholder="Search by name or #"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="w-full"
    />
  )
}
