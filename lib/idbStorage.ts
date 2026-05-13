'use client'

const DB_NAME = 'LiveDexStore'
const DB_VERSION = 1
const STORE_NAME = 'state'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

export async function loadFromIDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB()
    return new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(key)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => resolve(req.result ?? null)
    })
  } catch {
    return null
  }
}

export async function saveToIDB<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(value, key)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => resolve()
    })
  } catch (e) {
    console.warn(`IDB save failed for ${key}:`, e)
  }
}
