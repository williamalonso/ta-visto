import { View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useSeries } from '@/hooks/useSeries'
import { MediaCard } from '@/components/MediaCard'
import { StatusSelector } from '@/components/StatusSelector'
import { MediaItem, MediaStatus } from '@/types'
import { colors, spacing } from '@/theme'
import { SeriesLoading } from './components/SeriesLoading'
import { SeriesHeader } from './components/SeriesHeader'
import { SeriesEmpty } from './components/SeriesEmpty'

export default function SeriesScreen() {
  const { series, loading, reload, updateStatus, remove } = useSeries()
  const [filter, setFilter] = useState<MediaStatus | 'all'>('all')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  const filtered = filter === 'all' ? series : series.filter((s) => s.status === filter)

  const handleStatusChange = async (status: MediaStatus) => {
    if (!editingItem) return
    await updateStatus(editingItem.id, status)
    setEditingItem(null)
  }

  if (loading) return <SeriesLoading />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <SeriesHeader count={series.length} filter={filter} onFilterChange={setFilter} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ paddingHorizontal: spacing.xl, gap: spacing.md }}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxxl }}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <MediaCard item={item} onPress={() => setEditingItem(item)} onRemove={remove} />
          </View>
        )}
        ListEmptyComponent={<SeriesEmpty filter={filter} />}
        showsVerticalScrollIndicator={false}
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
