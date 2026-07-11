import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { POSTER_LARGE_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors, radius, spacing, typography, shadows } from '@/theme'

type Props = {
  item: MediaItem
  genres: string | null
  runtime: string | null
  detailLoading: boolean
}

export function DetailPosterInfo({ item, genres, runtime, detailLoading }: Props) {
  const posterUrl = item.posterPath ? `${POSTER_LARGE_BASE_URL}${item.posterPath}` : null
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''
  const rating = item.voteAverage ? item.voteAverage.toFixed(1) : '—'

  return (
    <View style={styles.infoRow}>
      <View style={styles.posterWrapper}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
      </View>

      <View style={styles.infoCol}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.meta}>
          {year}
          {runtime ? `  ·  ${runtime}` : ''}
        </Text>

        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{rating}</Text>
        </View>

        {genres ? (
          <Text style={styles.genres} numberOfLines={3}>
            {genres}
          </Text>
        ) : detailLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 4 }} />
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  posterWrapper: {
    width: 120,
    ...shadows.md,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: radius.md,
  },
  posterPlaceholder: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: colors.textAuxiliary,
  },
  infoCol: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
    fontSize: 17,
    color: colors.textPrimary,
    flexWrap: 'wrap',
  },
  meta: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  star: {
    color: colors.primary,
    fontSize: 14,
  },
  rating: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  genres: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
})
