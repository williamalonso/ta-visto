import { useRef, useState } from 'react'
import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native'
import { router } from 'expo-router'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors, spacing, typography, radius } from '@/theme'
import { Skeleton } from '@/components/Skeleton'
import { statusColor } from '@/utils/statusColor'

export function RecentCard({ item }: { item: MediaItem }) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  const [loaded, setLoaded] = useState(false)
  const imgOpacity = useRef(new Animated.Value(0)).current

  const onLoad = () => {
    setLoaded(true)
    Animated.timing(imgOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: Platform.OS !== 'web',
    }).start()
  }

  const dotColor = statusColor(item.status)

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
      onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id, mediaType: item.mediaType } } as any)}
    >
      <View style={styles.posterContainer}>
        {!loaded && <Skeleton width={96} height={144} borderRadius={radius.md} />}
        {posterUrl ? (
          <Animated.Image
            source={{ uri: posterUrl }}
            style={[styles.poster, { opacity: imgOpacity }]}
            resizeMode="cover"
            onLoad={onLoad}
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
          </View>
        )}
        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
        {item.rating != null && (
          <View style={styles.ratingOverlay}>
            <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.md,
  },
  posterContainer: {
    width: 120,
    height: 180,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  poster: {
    width: 120,
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  posterPlaceholder: {
    width: 120,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 22,
  },
  statusDot: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 3,
    paddingHorizontal: spacing.xs,
  },
  ratingText: {
    ...typography.auxiliary,
    color: colors.white,
    fontWeight: '700',
  },
})
