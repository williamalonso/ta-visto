import { useRef, useState } from 'react'
import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { MediaItem } from '@/types'
import { BACKDROP_BASE_URL, POSTER_BASE_URL } from '@/lib/tmdb'
import { colors, spacing, typography, radius, shadows } from '@/theme'
import { statusColor } from '@/utils/statusColor'
import { Skeleton } from '@/components/Skeleton'

interface Props {
  item: MediaItem
  onContinue: () => void
}

export function SpotlightCard({ item, onContinue }: Props) {
  const [loaded, setLoaded] = useState(false)
  const imgOpacity = useRef(new Animated.Value(0)).current

  const imageUrl = item.backdropPath
    ? `${BACKDROP_BASE_URL}${item.backdropPath}`
    : item.posterPath
    ? `${POSTER_BASE_URL}${item.posterPath}`
    : null

  const onLoad = () => {
    setLoaded(true)
    Animated.timing(imgOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: Platform.OS !== 'web',
    }).start()
  }

  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
      onPress={() =>
        router.push({
          pathname: '/detail/[id]',
          params: { id: item.id, mediaType: item.mediaType },
        } as any)
      }
    >
      {!loaded && <Skeleton width="100%" height={210} borderRadius={radius.xl} />}

      {imageUrl && (
        <Animated.Image
          source={{ uri: imageUrl }}
          style={[styles.image, { opacity: imgOpacity }]}
          resizeMode="cover"
          onLoad={onLoad}
        />
      )}
      {!imageUrl && <View style={styles.noImage} />}

      <LinearGradient
        colors={['transparent', 'rgba(10,11,16,0.96)']}
        locations={[0.35, 1]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{item.mediaType === 'movie' ? 'Filme' : 'Série'}</Text>
          {year ? <Text style={styles.metaDot}>·</Text> : null}
          {year ? <Text style={styles.metaText}>{year}</Text> : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.continueBtn, pressed && { opacity: 0.8 }]}
            onPress={(e) => { e.stopPropagation?.(); onContinue() }}
          >
            <SymbolView
              name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
              size={13}
              tintColor={colors.black}
            />
            <Text style={styles.continueBtnText}>Continuar</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    height: 210,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 340,
  },
  noImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surfaceSecondary,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    ...typography.cardTitle,
    fontSize: 18,
    color: colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.auxiliary,
    color: 'rgba(255,255,255,0.75)',
    ...Platform.select({
      web: { textShadow: '0px 1px 3px rgba(0,0,0,0.8)' },
      default: {
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
      },
    }),
  },
  metaDot: {
    ...typography.auxiliary,
    color: 'rgba(255,255,255,0.45)',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...Platform.select({
      web: { boxShadow: `0 0 12px ${colors.primary}60` },
      default: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  continueBtnText: {
    ...typography.auxiliary,
    fontWeight: '700',
    color: colors.black,
  },
})
