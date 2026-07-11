import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useSeries } from '@/hooks/useSeries'
import { Chip } from '@/components/Chip'
import { MediaCard } from '@/components/MediaCard'
import { StatusSelector } from '@/components/StatusSelector'
import { Skeleton } from '@/components/Skeleton'
import { MediaItem, MediaStatus } from '@/types'
import { colors, spacing, typography, radius } from '@/theme'

const STATUS_FILTERS: Array<{ value: MediaStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'watching', label: 'Assistindo' },
  { value: 'plan_to_watch', label: 'Pretendo' },
  { value: 'on_hold', label: 'Pausado' },
  { value: 'up_to_date', label: 'Em dia' },
  { value: 'completed', label: 'Finalizado' },
]

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

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Skeleton width="50%" height={28} />
          <View style={styles.skeletonGrid}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.skeletonItem}>
                <Skeleton width="100%" height={140} borderRadius={12} />
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Séries</Text>
          <Text style={styles.count}>{series.length}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {STATUS_FILTERS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              active={filter === f.value}
              onPress={() => setFilter(f.value)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <MediaCard
              item={item}
              onPress={() => setEditingItem(item)}
              onRemove={remove}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {filter === 'all' ? 'Nenhuma série adicionada.' : 'Nenhuma série nesta categoria.'}
            </Text>
          </View>
        }
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  skeletonItem: {
    width: '30%',
  },
  headerContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  count: {
    ...typography.body,
    color: colors.textSecondary,
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  filtersContent: {
    gap: spacing.sm,
  },
  row: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  cardWrapper: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
