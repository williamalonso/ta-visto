import { useCallback } from 'react'
import { MediaItem, MediaStatus } from '@/types'
import { useAsyncStorage } from './useAsyncStorage'

const KEY = '@cinelist:series'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useSeries() {
  const { value: series, setValue: setSeries, loading, reload } = useAsyncStorage<MediaItem[]>(
    KEY,
    []
  )

  const add = useCallback(
    async (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString()
      const newItem: MediaItem = { ...item, id: generateId(), createdAt: now, updatedAt: now }
      await setSeries([...series, newItem])
    },
    [series, setSeries]
  )

  const update = useCallback(
    async (id: string, changes: Partial<MediaItem>) => {
      await setSeries(
        series.map((s) =>
          s.id === id ? { ...s, ...changes, updatedAt: new Date().toISOString() } : s
        )
      )
    },
    [series, setSeries]
  )

  const remove = useCallback(
    async (id: string) => {
      await setSeries(series.filter((s) => s.id !== id))
    },
    [series, setSeries]
  )

  const updateStatus = useCallback(
    async (id: string, status: MediaStatus) => {
      await update(id, { status })
    },
    [update]
  )

  const exists = useCallback(
    (tmdbId: number) => series.some((s) => s.tmdbId === tmdbId),
    [series]
  )

  return { series, loading, add, update, remove, updateStatus, exists, reload }
}
