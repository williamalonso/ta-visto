import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useSeries } from '@/hooks/useSeries'
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
  { value: 'up_to_date' as const, label: 'Em dia' },
  { value: 'completed' as const, label: 'Finalizado' },
]

export default function SeriesScreen() {
  const { series, loading, reload, updateStatus, remove } = useSeries()
  const [filter, setFilter] = useState<MediaStatus | 'all'>('all')
  const [sort, setSort] = useState<SortOrder>('recent')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  if (loading) return <MediaListLoading />

  const filtered = filter === 'all' ? series : series.filter((s) => s.status === filter)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <MediaListHeader
        title="Séries"
        count={series.length}
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
        ListEmptyComponent={<MediaListEmpty mediaType="tv" filter={filter} />}
      />

      <StatusSelector
        visible={editingItem !== null}
        mediaType="tv"
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
