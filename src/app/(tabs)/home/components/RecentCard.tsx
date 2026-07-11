import { View, Text, Image } from 'react-native'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { recentCardStyles as styles } from './styles'

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
