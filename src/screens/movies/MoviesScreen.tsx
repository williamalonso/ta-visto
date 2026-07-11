import { View, FlatList, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, router } from 'expo-router'
import { useCallback, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { MediaCard } from '@/components/MediaCard'
import { StatusSelector } from '@/components/StatusSelector'
import { MediaItem, MediaStatus } from '@/types'
import { colors, spacing } from '@/theme'
import { MoviesLoading } from './components/MoviesLoading'
import { MoviesHeader } from './components/MoviesHeader'
import { MoviesEmpty } from './components/MoviesEmpty'

export default function MoviesScreen() {
  const { movies, loading, reload, updateStatus, remove } = useMovies()
  const { width: rawWidth } = useWindowDimensions()
  const width = Math.min(rawWidth, 480)
  const cardWidth = (width - spacing.xl * 2 - spacing.md * 2) / 3
  const [filter, setFilter] = useState<MediaStatus | 'all'>('all')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  const filtered = filter === 'all' ? movies : movies.filter((m) => m.status === filter)

  const handleStatusChange = async (status: MediaStatus) => {
    if (!editingItem) return
    await updateStatus(editingItem.id, status)
    setEditingItem(null)
  }

  if (loading) return <MoviesLoading />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <MoviesHeader count={movies.length} filter={filter} onFilterChange={setFilter} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ paddingHorizontal: spacing.xl, gap: spacing.md }}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxxl }}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <MediaCard
                item={item}
                onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id, mediaType: item.mediaType } })}
                onStatusPress={() => setEditingItem(item)}
                onRemove={remove}
              />
          </View>
        )}
        ListEmptyComponent={<MoviesEmpty filter={filter} />}
        showsVerticalScrollIndicator={false}
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
