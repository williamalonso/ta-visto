import { View, FlatList, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, router } from 'expo-router'
import { useCallback, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { MediaCard } from '@/components/MediaCard'
import { StatusSelector } from '@/components/StatusSelector'
import { MediaItem, MediaStatus } from '@/types'
import { colors, spacing, typography } from '@/theme'
import { buildSectionRows, SectionRow } from '@/utils/groupByStatus'
import { MoviesLoading } from './components/MoviesLoading'
import { MoviesHeader } from './components/MoviesHeader'
import { MoviesEmpty } from './components/MoviesEmpty'

const NUM_COLUMNS = 3

export default function MoviesScreen() {
  const { movies, loading, reload, updateStatus, remove } = useMovies()
  const { width: rawWidth } = useWindowDimensions()
  const width = Math.min(rawWidth, 480)
  const cardWidth = (width - spacing.xl * 2 - spacing.md * (NUM_COLUMNS - 1)) / NUM_COLUMNS
  const [filter, setFilter] = useState<MediaStatus | 'all'>('all')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  const filtered = filter === 'all' ? movies : movies.filter((m) => m.status === filter)
  const rows: SectionRow[] = filter === 'all'
    ? buildSectionRows(filtered, NUM_COLUMNS)
    : [{ type: 'cards', items: filtered, key: 'all' }]

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
        data={rows}
        keyExtractor={(item, i) => item.type === 'header' ? `h-${item.status}` : item.key ?? String(i)}
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<MoviesEmpty filter={filter} />}
        renderItem={({ item: row }) => {
          if (row.type === 'header') {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>{row.label}</Text>
                <View style={styles.divider} />
              </View>
            )
          }
          return (
            <View style={styles.row}>
              {row.items.map((item) => (
                <View key={item.id} style={{ width: cardWidth }}>
                  <MediaCard
                    item={item}
                    onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id, mediaType: item.mediaType } })}
                    onStatusPress={() => setEditingItem(item)}
                    onRemove={remove}
                  />
                </View>
              ))}
              {row.items.length < NUM_COLUMNS && Array.from({ length: NUM_COLUMNS - row.items.length }).map((_, i) => (
                <View key={`spacer-${i}`} style={{ width: cardWidth }} />
              ))}
            </View>
          )
        }}
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

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
})
