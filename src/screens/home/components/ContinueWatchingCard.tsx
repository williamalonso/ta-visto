import { View, Text, Image, Pressable } from 'react-native'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors } from '@/theme'
import { continueWatchingCardStyles as styles } from './styles'

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
