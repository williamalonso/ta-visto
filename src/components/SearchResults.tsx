import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useCardWidth } from '@/hooks/useCardWidth'
import { TmdbResult } from '@/types'
import { Skeleton } from './Skeleton'
import { TmdbCard } from './TmdbCard'
import { colors, radius, spacing, typography } from '@/theme'

function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <Skeleton width="100%" height={150} borderRadius={radius.md} />
      <Skeleton width="70%" height={11} />
    </View>
  )
}

interface Props {
  results: TmdbResult[]
  loading: boolean
  error: string | null
  isAdded: (tmdbId: number) => boolean
  onAdd: (item: TmdbResult) => void
  onPress: (item: TmdbResult) => void
}

export function SearchResults({ results, loading, error, isAdded, onAdd, onPress }: Props) {
  const cardWidth = useCardWidth()

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro ao buscar: {error}</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.skeletonGrid}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={{ width: cardWidth }}>
            <SkeletonCard />
          </View>
        ))}
      </View>
    )
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => `${item.mediaType}-${item.id}`}
      numColumns={3}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={{ width: cardWidth }}>
          <TmdbCard item={item} isAdded={isAdded(item.id)} onPress={() => onPress(item)} onAdd={() => onAdd(item)} numberOfLines={1} addTestID={`add-btn-${item.id}`} />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  skeletonCard: {
    gap: spacing.xs,
  },
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxxl,
  },
})
