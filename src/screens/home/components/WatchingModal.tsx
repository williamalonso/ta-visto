import { View, Text, Modal, Pressable, ScrollView, Image, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { MediaItem } from '@/types'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'

interface Props {
  visible: boolean
  movies: MediaItem[]
  series: MediaItem[]
  onClose: () => void
}

function WatchingCard({ item, onPress }: { item: MediaItem; onPress: () => void }) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder]}>
          <Text style={styles.placeholderText}>?</Text>
        </View>
      )}
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardYear}>{year}</Text>
    </Pressable>
  )
}

function Section({ title, items, onClose }: { title: string; items: MediaItem[]; onClose: () => void }) {
  if (items.length === 0) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <WatchingCard
            key={item.id}
            item={item}
            onPress={() => {
              onClose()
              router.push({ pathname: '/detail/[id]', params: { id: item.id, mediaType: item.mediaType } })
            }}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export function WatchingModal({ visible, movies, series, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Assistindo</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Section title="Filmes" items={movies} onClose={onClose} />
            <Section title="Séries" items={series} onClose={onClose} />
            {movies.length === 0 && series.length === 0 && (
              <Text style={styles.empty}>Nenhum item em andamento.</Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  card: {
    width: 80,
  },
  cardPressed: {
    opacity: 0.7,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: radius.md,
  },
  posterPlaceholder: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: colors.textAuxiliary,
  },
  cardTitle: {
    ...typography.auxiliary,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  cardYear: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
})
