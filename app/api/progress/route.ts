/**
 * Progress persistence API
 *
 * Dev / Self-hosted: stores data in data/user-progress.json (file system)
 * Vercel: file writes are ephemeral on serverless.
 *   For production on Vercel, replace the file store with:
 *   - Vercel KV (Redis): https://vercel.com/docs/storage/vercel-kv
 *   - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
 *   - Or any other database via Prisma/Drizzle
 *
 * Just swap the read/write functions — the API shape stays the same.
 */

import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface ProgressData {
  caughtSpecies: number[]
  updatedAt: number
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PROGRESS_FILE = path.join(DATA_DIR, 'user-progress.json')

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readProgress(): Promise<ProgressData> {
  try {
    await ensureDataDir()
    const content = await fs.readFile(PROGRESS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return { caughtSpecies: [], updatedAt: Date.now() }
  }
}

async function writeProgress(data: ProgressData): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const data = await readProgress()
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { caughtSpecies } = body

    if (!Array.isArray(caughtSpecies) || !caughtSpecies.every((id: unknown) => typeof id === 'number')) {
      return NextResponse.json(
        { error: 'Invalid data: caughtSpecies must be an array of numbers' },
        { status: 400 }
      )
    }

    const data: ProgressData = {
      caughtSpecies,
      updatedAt: Date.now(),
    }

    await writeProgress(data)
    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    )
  }
}
