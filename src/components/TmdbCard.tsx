import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { TmdbResult } from '@/types'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { colors, radius, spacing, typography, shadows } from '@/theme'

interface Props {
  item: TmdbResult
  isAdded: boolean
  onPress: () => void
  onAdd: () => void
  numberOfLines?: number
  testID?: string
  addTestID?: string
}

export function TmdbCard({ item, isAdded, onPress, onAdd, numberOfLines = 2, testID, addTestID }: Props) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null

  return (
    <Pressable testID={testID} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.posterContainer}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
          </View>
        )}
        <Pressable
          testID={addTestID}
          style={[styles.badge, isAdded && styles.badgeAdded]}
          onPress={(e) => { e.stopPropagation?.(); if (!isAdded) onAdd() }}
          hitSlop={6}
        >
          <Text style={styles.badgeText}>{isAdded ? '✓' : '+'}</Text>
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={numberOfLines}>{item.title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
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
