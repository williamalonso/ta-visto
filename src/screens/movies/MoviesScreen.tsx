import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { StatusSelector } from '@/components/StatusSelector'
import { MediaGrid } from '@/components/MediaGrid'
import { MediaItem, MediaStatus } from '@/types'
import { colors, spacing } from '@/theme'
import { SortOrder } from '@/utils/groupByStatus'
import { MoviesLoading } from './components/MoviesLoading'
import { MoviesHeader } from './components/MoviesHeader'
import { MoviesEmpty } from './components/MoviesEmpty'

export default function MoviesScreen() {
  const { movies, loading, reload, updateStatus, remove } = useMovies()
  const [filter, setFilter] = useState<MediaStatus | 'all'>('all')
  const [sort, setSort] = useState<SortOrder>('recent')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  const handleStatusChange = async (status: MediaStatus) => {
    if (!editingItem) return
    await updateStatus(editingItem.id, status)
    setEditingItem(null)
  }

  if (loading) return <MoviesLoading />

  const filtered = filter === 'all' ? movies : movies.filter((m) => m.status === filter)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <MoviesHeader count={movies.length} filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort} />

      <MediaGrid
        items={filtered}
        filter={filter}
        sort={sort}
        onStatusPress={setEditingItem}
        onRemove={remove}
        ListEmptyComponent={<MoviesEmpty filter={filter} />}
      />

      <StatusSelector
        visible={editingItem !== null}
        mediaType="movie"
        onSelect={handleStatusChange}
        onClose={() => setEditingItem(null)}
      />
    </SafeAreaView>
  )
}
