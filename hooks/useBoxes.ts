'use client'

import { useCallback } from 'react'
import { BoxStorage } from '@/types/box'
import {
  createBox as dbCreateBox,
  updateBox as dbUpdateBox,
  deleteBox as dbDeleteBox,
} from '@/lib/db'
import { usePokemonStore } from '@/store/pokemonStore'

export function useBoxes() {
  const { boxes, addBox, updateBox, deleteBox } = usePokemonStore()

  const createBox = useCallback(
    async (name: string, color: string) => {
      try {
        const id = await dbCreateBox({
          name,
          color,
          pokemonIds: [],
          isFavorite: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })

        addBox({
          id,
          name,
          color,
          pokemonIds: [],
          isFavorite: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })

        return id
      } catch (error) {
        console.error('[v0] Failed to create box:', error)
        throw error
      }
    },
    [addBox]
  )

  const renameBox = useCallback(
    async (boxId: string, newName: string) => {
      try {
        await dbUpdateBox(boxId, { name: newName })
        updateBox(boxId, { name: newName })
      } catch (error) {
        console.error('[v0] Failed to rename box:', error)
        throw error
      }
    },
    [updateBox]
  )

  const toggleFavoriteBox = useCallback(
    async (boxId: string) => {
      const box = boxes.find((b) => b.id === boxId)
      if (!box) return

      try {
        const newValue = !box.isFavorite
        await dbUpdateBox(boxId, { isFavorite: newValue })
        updateBox(boxId, { isFavorite: newValue })
      } catch (error) {
        console.error('[v0] Failed to toggle favorite:', error)
        throw error
      }
    },
    [boxes, updateBox]
  )

  const removeBox = useCallback(
    async (boxId: string) => {
      try {
        await dbDeleteBox(boxId)
        deleteBox(boxId)
      } catch (error) {
        console.error('[v0] Failed to delete box:', error)
        throw error
      }
    },
    [deleteBox]
  )

  return {
    boxes,
    createBox,
    renameBox,
    toggleFavoriteBox,
    removeBox,
  }
}
