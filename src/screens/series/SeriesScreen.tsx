import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useSeries } from '@/hooks/useSeries'
import { StatusSelector } from '@/components/StatusSelector'
import { MediaGrid } from '@/components/MediaGrid'
import { MediaItem, MediaStatus } from '@/types'
import { colors } from '@/theme'
import { SortOrder } from '@/utils/groupByStatus'
import { SeriesLoading } from './components/SeriesLoading'
import { SeriesHeader } from './components/SeriesHeader'
import { SeriesEmpty } from './components/SeriesEmpty'

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

  const handleStatusChange = async (status: MediaStatus) => {
    if (!editingItem) return
    await updateStatus(editingItem.id, status)
    setEditingItem(null)
  }

  if (loading) return <SeriesLoading />

  const filtered = filter === 'all' ? series : series.filter((s) => s.status === filter)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <SeriesHeader count={series.length} filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort} />

      <MediaGrid
        items={filtered}
        filter={filter}
        sort={sort}
        onStatusPress={setEditingItem}
        onRemove={remove}
        ListEmptyComponent={<SeriesEmpty filter={filter} />}
      />

      <StatusSelector
        visible={editingItem !== null}
        mediaType="tv"
        onSelect={handleStatusChange}
        onClose={() => setEditingItem(null)}
      />
    </SafeAreaView>
  )
}
