import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { MediaItem, MediaStatus } from '@/types'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { colors, radius, spacing, typography, shadows } from '@/theme'

const STATUS_COLORS: Record<MediaStatus, string> = {
  watching: colors.watching,
  plan_to_watch: colors.planned,
  on_hold: colors.paused,
  up_to_date: colors.success,
  completed: colors.completed,
}

const STATUS_LABELS: Record<MediaStatus, string> = {
  watching: 'Assistindo',
  plan_to_watch: 'Pretendo',
  on_hold: 'Pausado',
  up_to_date: 'Em dia',
  completed: 'Finalizado',
}

interface MediaCardProps {
  item: MediaItem
  onPress: () => void
  onStatusPress: () => void
  onRemove: (id: string) => void
}

export function MediaCard({ item, onPress, onStatusPress, onRemove }: MediaCardProps) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleLongPress = () => {
    Alert.alert(item.title, undefined, [
      { text: 'Mudar status', onPress: onStatusPress },
      { text: 'Remover', style: 'destructive', onPress: () => onRemove(item.id) },
      { text: 'Cancelar', style: 'cancel' },
    ])
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={400}
    >
      <View style={styles.posterContainer}>
        {posterUrl ? (
          <>
            {!imgLoaded && (
              <View style={[StyleSheet.absoluteFill, styles.posterPlaceholder]}>
                <Text style={styles.placeholderText}>?</Text>
              </View>
            )}
            <Image
              source={{ uri: posterUrl }}
              style={[styles.poster, !imgLoaded && styles.posterHidden]}
              resizeMode="cover"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.status} numberOfLines={1}>
        {STATUS_LABELS[item.status]}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  posterContainer: {
    aspectRatio: 2 / 3,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterHidden: {
    opacity: 0,
  },
  posterPlaceholder: {
    flex: 1,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: colors.textAuxiliary,
  },
  statusDot: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  title: {
    ...typography.auxiliary,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
  },
  status: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
})
