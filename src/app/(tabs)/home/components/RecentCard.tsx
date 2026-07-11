import { View, Text, Image, StyleSheet } from 'react-native'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors, spacing, typography, radius } from '@/theme'

export function RecentCard({ item }: { item: MediaItem }) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''

  return (
    <View style={styles.card}>
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Text style={styles.placeholderEmoji}>🎬</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.year}>{year}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 72,
    marginRight: spacing.md,
  },
  poster: {
    width: 72,
    height: 108,
    borderRadius: radius.md,
  },
  posterPlaceholder: {
    width: 72,
    height: 108,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 24,
  },
  title: {
    ...typography.auxiliary,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  year: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
  },
})
