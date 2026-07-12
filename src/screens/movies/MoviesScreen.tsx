import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { StatusSelector } from '@/components/StatusSelector'
import { MediaGrid } from '@/components/MediaGrid'
import { MediaListLoading } from '@/components/MediaListLoading'
import { MediaListEmpty } from '@/components/MediaListEmpty'
import { MediaListHeader } from '@/components/MediaListHeader'
import { MediaItem, MediaStatus } from '@/types'
import { colors } from '@/theme'
import { SortOrder } from '@/utils/groupByStatus'

const FILTERS = [
  { value: 'all' as const, label: 'Todos' },
  { value: 'watching' as const, label: 'Assistindo' },
  { value: 'plan_to_watch' as const, label: 'Pretendo' },
  { value: 'on_hold' as const, label: 'Pausado' },
  { value: 'completed' as const, label: 'Finalizado' },
]

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

  if (loading) return <MediaListLoading />

  const filtered = filter === 'all' ? movies : movies.filter((m) => m.status === filter)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <MediaListHeader
        title="Filmes"
        count={movies.length}
        filters={FILTERS}
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      <MediaGrid
        items={filtered}
        filter={filter}
        sort={sort}
        onStatusPress={setEditingItem}
        onRemove={remove}
        ListEmptyComponent={<MediaListEmpty mediaType="movie" filter={filter} />}
      />

      <StatusSelector
        visible={editingItem !== null}
        mediaType="movie"
        onSelect={async (status: MediaStatus) => {
          if (!editingItem) return
          await updateStatus(editingItem.id, status)
          setEditingItem(null)
        }}
        onClose={() => setEditingItem(null)}
      />
    </SafeAreaView>
  )
}
