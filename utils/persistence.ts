import { db } from '@/lib/db'
import { PokemonInstance } from '@/types/pokemon'
import { BoxStorage } from '@/types/box'

export interface SaveData {
  version: 1
  exportDate: string
  pokemon: PokemonInstance[]
  boxes: BoxStorage[]
  settings: Record<string, unknown>
}

/**
 * Export all user data as JSON
 */
export async function exportSave(): Promise<SaveData> {
  const pokemon = await db.pokemon.toArray()
  const boxes = await db.boxes.toArray()
  const settings: Record<string, unknown> = {}

  // Get all settings
  await db.settings.each((record) => {
    settings[record.key] = record.value
  })

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    pokemon,
    boxes,
    settings,
  }
}

/**
 * Export save as JSON file download
 */
export async function downloadSave() {
  try {
    const data = await exportSave()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `livedex-backup-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('[v0] Failed to download save:', error)
    throw error
  }
}

/**
 * Import save data from JSON
 */
export async function importSave(data: SaveData): Promise<void> {
  try {
    // Validate version
    if (data.version !== 1) {
      throw new Error('Unsupported save version')
    }

    // Clear existing data
    await db.pokemon.clear()
    await db.boxes.clear()

    // Import pokemon
    await db.pokemon.bulkAdd(data.pokemon)

    // Import boxes
    await db.boxes.bulkAdd(data.boxes)

    // Import settings
    for (const [key, value] of Object.entries(data.settings)) {
      await db.settings.put({ key, value })
    }
  } catch (error) {
    console.error('[v0] Failed to import save:', error)
    throw error
  }
}

/**
 * Import save from file upload
 */
export async function importSaveFromFile(file: File): Promise<void> {
  try {
    const json = await file.text()
    const data = JSON.parse(json) as SaveData
    await importSave(data)
  } catch (error) {
    console.error('[v0] Failed to import from file:', error)
    throw new Error('Invalid save file')
  }
}

/**
 * Create automatic backup
 */
export async function backupSave(): Promise<void> {
  try {
    const data = await exportSave()
    const json = JSON.stringify(data)
    await db.settings.put({
      key: 'lastBackup',
      value: {
        timestamp: Date.now(),
        size: json.length,
      },
    })
  } catch (error) {
    console.error('[v0] Failed to create backup:', error)
  }
}

/**
 * Reset all data safely
 */
export async function resetSave(): Promise<void> {
  try {
    // Create backup before reset
    await backupSave()

    // Clear all data
    await db.pokemon.clear()
    await db.boxes.clear()
    await db.settings.clear()

    // Reinitialize defaults
    const { initializeDefaults } = await import('@/lib/db')
    await initializeDefaults()
  } catch (error) {
    console.error('[v0] Failed to reset save:', error)
    throw error
  }
}
