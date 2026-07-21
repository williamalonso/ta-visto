import { useRef, useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet, Animated, Platform } from 'react-native'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import Reanimated, { FadeIn } from 'react-native-reanimated'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors, spacing, typography, radius } from '@/theme'
import { Skeleton } from '@/components/Skeleton'

interface Props {
  item: MediaItem
  index?: number
  onPlayPress: () => void
}

export function ContinueWatchingCard({ item, index = 0, onPlayPress }: Props) {
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

  return (
    <Reanimated.View entering={FadeIn.delay(index * 70).duration(350)} style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id, mediaType: item.mediaType } } as any)}
      >
        {!loaded && <Skeleton width={120} height={180} borderRadius={radius.md} />}
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
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.mediaType === 'movie' ? 'Filme' : 'Série'}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.playButton, pressed && { opacity: 0.75 }]}
          onPress={(e) => { e.stopPropagation?.(); onPlayPress() }}
          hitSlop={8}
        >
          <SymbolView
            name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
            size={13}
            tintColor={colors.white}
          />
        </Pressable>
      </Pressable>
    </Reanimated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight: spacing.md,
  },
  card: {
    width: 120,
    height: 180,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
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
    fontSize: 24,
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  typeText: {
    ...typography.auxiliary,
    color: colors.white,
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
