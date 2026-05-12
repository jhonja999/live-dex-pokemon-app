'use client'

import { useState } from 'react'
import { useBoxes } from '@/hooks/useBoxes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FiPlus, FiTrash2, FiStar } from 'react-icons/fi'

export default function BoxList() {
  const { boxes, createBox, renameBox, toggleFavoriteBox, removeBox } = useBoxes()
  const [isCreating, setIsCreating] = useState(false)
  const [newBoxName, setNewBoxName] = useState('')
  const [editingBoxId, setEditingBoxId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleCreateBox = async () => {
    if (!newBoxName.trim()) return

    try {
      await createBox(newBoxName, '#3b82f6')
      setNewBoxName('')
      setIsCreating(false)
    } catch (error) {
      console.error('[v0] Failed to create box:', error)
    }
  }

  const handleRename = async (boxId: string) => {
    if (!editingName.trim()) return

    try {
      await renameBox(boxId, editingName)
      setEditingBoxId(null)
      setEditingName('')
    } catch (error) {
      console.error('[v0] Failed to rename box:', error)
    }
  }

  const handleToggleFavorite = async (boxId: string) => {
    try {
      await toggleFavoriteBox(boxId)
    } catch (error) {
      console.error('[v0] Failed to toggle favorite:', error)
    }
  }

  const handleDeleteBox = async (boxId: string) => {
    try {
      await removeBox(boxId)
    } catch (error) {
      console.error('[v0] Failed to delete box:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-foreground">Boxes</h3>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FiPlus className="w-4 h-4 mr-2" />
              New Box
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Box</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Box name (e.g., Shinies)"
                value={newBoxName}
                onChange={(e) => setNewBoxName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateBox()
                }}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateBox} className="flex-1">
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setNewBoxName('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {boxes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No boxes yet</p>
        ) : (
          boxes.map((box) => (
            <div
              key={box.id}
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
            >
              {editingBoxId === box.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRename(box.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(box.id)
                  }}
                  className="flex-1 h-8"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => {
                    setEditingBoxId(box.id)
                    setEditingName(box.name)
                  }}
                  className="flex-1 text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {box.name}
                </button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleToggleFavorite(box.id)}
                className="w-8 h-8 p-0"
              >
                <FiStar
                  className="w-4 h-4"
                  fill={box.isFavorite ? 'currentColor' : 'none'}
                />
              </Button>

              {box.name !== 'Box 1' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteBox(box.id)}
                  className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              )}

              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {box.pokemonIds.length}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
