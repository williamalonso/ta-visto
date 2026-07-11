import { View, Text, Image, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { TmdbResult } from '@/types'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'

interface TrendingCardProps {
  item: TmdbResult
  isAdded: boolean
  onPress: () => void
  onAdd: () => void
}

function TrendingCard({ item, isAdded, onPress, onAdd }: TrendingCardProps) {
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
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
        <Pressable
          style={[styles.badge, isAdded && styles.badgeAdded]}
          onPress={(e) => { e.stopPropagation?.(); if (!isAdded) onAdd() }}
          hitSlop={6}
        >
          <Text style={styles.badgeText}>{isAdded ? '✓' : '+'}</Text>
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
    </Pressable>
  )
}

interface SectionProps {
  title: string
  items: TmdbResult[]
  isAdded: (id: number) => boolean
  onPress: (item: TmdbResult) => void
  onAdd: (item: TmdbResult) => void
}

function TrendingRow({ title, items, isAdded, onPress, onAdd }: SectionProps) {
  if (items.length === 0) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <TrendingCard key={item.id} item={item} isAdded={isAdded(item.id)} onPress={() => onPress(item)} onAdd={() => onAdd(item)} />
        ))}
      </ScrollView>
    </View>
  )
}

interface Props {
  movies: TmdbResult[]
  series: TmdbResult[]
  loading: boolean
  isAdded: (id: number, mediaType: 'movie' | 'tv') => boolean
  onAdd: (item: TmdbResult) => void
  onPress: (item: TmdbResult) => void
}

export function TrendingSection({ movies, series, loading, isAdded, onAdd, onPress }: Props) {
  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Em alta agora</Text>
      <TrendingRow title="Filmes" items={movies} isAdded={(id) => isAdded(id, 'movie')} onPress={onPress} onAdd={onAdd} />
      <TrendingRow title="Séries" items={series} isAdded={(id) => isAdded(id, 'tv')} onPress={onPress} onAdd={onAdd} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  card: {
    width: 90,
    gap: spacing.xs,
  },
  cardPressed: {
    opacity: 0.75,
  },
  posterContainer: {
    width: 90,
    height: 135,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: colors.textAuxiliary,
  },
  badge: {
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
  badgeAdded: {
    backgroundColor: colors.success,
  },
  badgeText: {
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
