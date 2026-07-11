import { useCallback } from 'react'
import { MediaItem, MediaStatus } from '@/types'
import { useAsyncStorage } from './useAsyncStorage'

const KEY = '@cinelist:movies'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useMovies() {
  const { value: movies, setValue: setMovies, loading, reload } = useAsyncStorage<MediaItem[]>(
    KEY,
    []
  )

  const add = useCallback(
    async (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString()
      const newItem: MediaItem = { ...item, id: generateId(), createdAt: now, updatedAt: now }
      await setMovies([...movies, newItem])
    },
    [movies, setMovies]
  )

  const update = useCallback(
    async (id: string, changes: Partial<MediaItem>) => {
      await setMovies(
        movies.map((m) =>
          m.id === id ? { ...m, ...changes, updatedAt: new Date().toISOString() } : m
        )
      )
    },
    [movies, setMovies]
  )

  const remove = useCallback(
    async (id: string) => {
      await setMovies(movies.filter((m) => m.id !== id))
    },
    [movies, setMovies]
  )

  const updateStatus = useCallback(
    async (id: string, status: MediaStatus) => {
      await update(id, { status })
    },
    [update]
  )

  const exists = useCallback(
    (tmdbId: number) => movies.some((m) => m.tmdbId === tmdbId),
    [movies]
  )

  return { movies, loading, add, update, remove, updateStatus, exists, reload }
}
