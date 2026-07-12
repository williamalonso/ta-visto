import { View, Text, Image, Pressable, FlatList, StyleSheet } from 'react-native'
import { useCardWidth } from '@/hooks/useCardWidth'
import { TmdbResult } from '@/types'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { Skeleton } from './Skeleton'
import { colors, radius, spacing, typography, shadows } from '@/theme'

interface SearchResultCardProps {
  item: TmdbResult
  isAdded: boolean
  onPress: () => void
  onAdd: () => void
}

function SearchResultCard({ item, isAdded, onPress, onAdd }: SearchResultCardProps) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.posterContainer}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
          </View>
        )}
        <Pressable
          style={[styles.addBadge, isAdded && styles.addBadgeAdded]}
          onPress={(e) => { e.stopPropagation?.(); if (!isAdded) onAdd() }}
          hitSlop={6}
        >
          <Text style={styles.addBadgeText}>{isAdded ? '✓' : '+'}</Text>
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  )
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={150} borderRadius={radius.md} />
      <Skeleton width="70%" height={11} />
    </View>
  )
}

interface SearchResultsProps {
  results: TmdbResult[]
  loading: boolean
  error: string | null
  isAdded: (tmdbId: number) => boolean
  onAdd: (item: TmdbResult) => void
  onPress: (item: TmdbResult) => void
}

export function SearchResults({ results, loading, error, isAdded, onAdd, onPress }: SearchResultsProps) {
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
      renderItem={({ item }) => (
        <View style={{ width: cardWidth }}>
          <SearchResultCard item={item} isAdded={isAdded(item.id)} onPress={() => onPress(item)} onAdd={() => onAdd(item)} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
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
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    gap: spacing.xs,
    ...shadows.sm,
  },
  cardPressed: {
    opacity: 0.75,
  },
  posterContainer: {
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 20,
  },
  addBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBadgeAdded: {
    backgroundColor: colors.success,
  },
  addBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 16,
  },
  title: {
    ...typography.auxiliary,
    color: colors.textPrimary,
    fontWeight: '500',
  },
})
