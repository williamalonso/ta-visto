import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { StatusSelector } from '@/components/StatusSelector'
import { SeasonList } from './SeasonList'
import {
  POSTER_LARGE_BASE_URL,
  getMovieDetails,
  getTvDetails,
  TmdbMovieDetail,
  TmdbTvDetail,
} from '@/lib/tmdb'
import { MediaItem, MediaStatus } from '@/types'
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
  plan_to_watch: 'Pretendo assistir',
  on_hold: 'Assistir depois',
  up_to_date: 'Em dia',
  completed: 'Finalizado',
}

export default function DetailScreen() {
  const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: string }>()
  const { movies, updateStatus: updateMovieStatus, update: updateMovie } = useMovies()
  const { series, updateStatus: updateSeriesStatus, update: updateSeries } = useSeries()

  const item: MediaItem | undefined =
    mediaType === 'movie'
      ? movies.find((m) => m.id === id)
      : series.find((s) => s.id === id)

  const [tmdbDetail, setTmdbDetail] = useState<TmdbMovieDetail | TmdbTvDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [statusSelectorVisible, setStatusSelectorVisible] = useState(false)

  useEffect(() => {
    if (!item) return
    setDetailLoading(true)
    const fetch =
      item.mediaType === 'movie'
        ? getMovieDetails(item.tmdbId)
        : getTvDetails(item.tmdbId)
    fetch
      .then(setTmdbDetail)
      .finally(() => setDetailLoading(false))
  }, [item?.tmdbId])

  const handleStatusChange = async (status: MediaStatus) => {
    if (!item) return
    if (item.mediaType === 'movie') await updateMovieStatus(item.id, status)
    else await updateSeriesStatus(item.id, status)
    setStatusSelectorVisible(false)
  }

  const handleToggleEpisode = async (key: string) => {
    if (!item) return
    const current = item.watchedEpisodes ?? []
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    if (item.mediaType === 'movie') await updateMovie(item.id, { watchedEpisodes: next })
    else await updateSeries(item.id, { watchedEpisodes: next })
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    )
  }

  const posterUrl = item.posterPath ? `${POSTER_LARGE_BASE_URL}${item.posterPath}` : null
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''
  const rating = item.voteAverage ? item.voteAverage.toFixed(1) : '—'

  const genres =
    tmdbDetail && 'genres' in tmdbDetail
      ? tmdbDetail.genres.map((g) => g.name).join(', ')
      : null

  const runtime =
    tmdbDetail && 'runtime' in tmdbDetail && tmdbDetail.runtime
      ? `${tmdbDetail.runtime} min`
      : null

  const tvDetail = item.mediaType === 'tv' && tmdbDetail ? (tmdbDetail as TmdbTvDetail) : null
  const watchedEpisodes = item.watchedEpisodes ?? []

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Voltar</Text>
        </Pressable>

        {/* Poster + Info */}
        <View style={styles.infoRow}>
          <View style={styles.posterWrapper}>
            {posterUrl ? (
              <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
            ) : (
              <View style={[styles.poster, styles.posterPlaceholder]}>
                <Text style={styles.placeholderText}>?</Text>
              </View>
            )}
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.meta}>
              {year}
              {runtime ? `  ·  ${runtime}` : ''}
            </Text>

            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{rating}</Text>
            </View>

            {genres ? (
              <Text style={styles.genres} numberOfLines={3}>
                {genres}
              </Text>
            ) : detailLoading ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 4 }} />
            ) : null}
          </View>
        </View>

        {/* Status card */}
        <Pressable
          style={({ pressed }) => [styles.statusCard, pressed && styles.statusCardPressed]}
          onPress={() => setStatusSelectorVisible(true)}
        >
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
          <Text style={styles.statusLabel}>{STATUS_LABELS[item.status]}</Text>
          <Text style={styles.statusAction}>Alterar</Text>
          <Text style={styles.statusChevron}>›</Text>
        </Pressable>

        {/* Overview */}
        {item.overview ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinopse</Text>
            <Text style={styles.overview}>{item.overview}</Text>
          </View>
        ) : null}

        {/* Seasons */}
        {item.mediaType === 'tv' && (
          <View style={styles.section}>
            {detailLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : tvDetail && tvDetail.seasons.length > 0 ? (
              <SeasonList
                seasons={tvDetail.seasons}
                tmdbId={item.tmdbId}
                watchedEpisodes={watchedEpisodes}
                onToggleEpisode={handleToggleEpisode}
              />
            ) : null}
          </View>
        )}
      </ScrollView>

      <StatusSelector
        visible={statusSelectorVisible}
        mediaType={item.mediaType}
        onSelect={handleStatusChange}
        onClose={() => setStatusSelectorVisible(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  posterWrapper: {
    width: 120,
    ...shadows.md,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: radius.md,
  },
  posterPlaceholder: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: colors.textAuxiliary,
  },
  infoCol: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
    fontSize: 17,
    color: colors.textPrimary,
    flexWrap: 'wrap',
  },
  meta: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  star: {
    color: colors.primary,
    fontSize: 14,
  },
  rating: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  genres: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statusCardPressed: {
    opacity: 0.7,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    flex: 1,
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusAction: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  statusChevron: {
    fontSize: 20,
    color: colors.textAuxiliary,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  overview: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
})
