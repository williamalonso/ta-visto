import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors, spacing, typography, radius, shadows } from '@/theme'

export function ContinueWatchingCard({ item }: { item: MediaItem }) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  const destination = item.mediaType === 'movie' ? '/(tabs)/movies' : '/(tabs)/series'

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(destination as any)}
    >
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Text style={styles.placeholderEmoji}>🎬</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.type}>{item.mediaType === 'movie' ? 'Filme' : 'Série'}</Text>
      </View>
      <View style={styles.playButton}>
        <SymbolView
          name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
          size={14}
          tintColor={colors.white}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  poster: {
    width: 48,
    height: 72,
    borderRadius: radius.sm,
  },
  posterPlaceholder: {
    width: 48,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  type: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
