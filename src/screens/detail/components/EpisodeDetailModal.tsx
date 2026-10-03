import { View, Text, Modal, Pressable, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { getEpisodeDetails, TmdbEpisode, STILL_BASE_URL } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'

interface Props {
  visible: boolean
  tmdbId: number
  seasonNumber: number
  episodeNumber: number
  onClose: () => void
}

export function EpisodeDetailModal({ visible, tmdbId, seasonNumber, episodeNumber, onClose }: Props) {
  const [episode, setEpisode] = useState<TmdbEpisode | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    setEpisode(null)
    getEpisodeDetails(tmdbId, seasonNumber, episodeNumber)
      .then(setEpisode)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [visible, tmdbId, seasonNumber, episodeNumber])

  const director = episode?.crew?.find((c) => c.job === 'Director')?.name
  const guests = episode?.guest_stars?.slice(0, 4).map((g) => g.name).join(', ')
  const airDate = episode?.air_date
    ? new Date(episode.air_date + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ paddingVertical: spacing.huge }} />
          ) : episode ? (
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {episode.still_path ? (
                <Image
                  source={{ uri: `${STILL_BASE_URL}${episode.still_path}` }}
                  style={styles.still}
                  resizeMode="cover"
                />
              ) : null}
              <View style={styles.content}>
                <Text style={styles.numbering}>
                  T{episode.season_number} · E{episode.episode_number}
                </Text>
                <Text style={styles.title}>{episode.name}</Text>
                <View style={styles.meta}>
                  {airDate ? <Text style={styles.metaItem}>{airDate}</Text> : null}
                  {episode.runtime ? <Text style={styles.metaItem}>{episode.runtime} min</Text> : null}
                  {episode.vote_average > 0 ? (
                    <Text style={styles.metaItem}>★ {episode.vote_average.toFixed(1)}</Text>
                  ) : null}
                </View>
                {episode.overview ? (
                  <Text style={styles.overview}>{episode.overview}</Text>
                ) : (
                  <Text style={styles.noData}>Sem sinopse disponível.</Text>
                )}
                {director ? (
                  <Text style={styles.credit}>Direção: {director}</Text>
                ) : null}
                {guests ? (
                  <Text style={styles.credit}>Participações: {guests}</Text>
                ) : null}
              </View>
            </ScrollView>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '82%',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  still: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  numbering: {
    ...typography.auxiliary,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  overview: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  noData: {
    ...typography.body,
    color: colors.textAuxiliary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  credit: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
})
