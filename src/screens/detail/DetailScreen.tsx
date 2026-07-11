import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { StatusSelector } from '@/components/StatusSelector'
import { SeasonList } from './SeasonList'
import { DetailBackButton } from './components/DetailBackButton'
import { DetailPosterInfo } from './components/DetailPosterInfo'
import { DetailStatusCard } from './components/DetailStatusCard'
import { DetailOverview } from './components/DetailOverview'
import {
  getMovieDetails,
  getTvDetails,
  TmdbMovieDetail,
  TmdbTvDetail,
} from '@/lib/tmdb'
import { MediaItem, MediaStatus } from '@/types'
import { colors, spacing } from '@/theme'

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
        <DetailBackButton />
        <DetailPosterInfo
          item={item}
          genres={genres}
          runtime={runtime}
          detailLoading={detailLoading}
        />
        <DetailStatusCard item={item} onPress={() => setStatusSelectorVisible(true)} />
        {item.overview ? <DetailOverview overview={item.overview} /> : null}
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
  section: {
    marginTop: spacing.md,
  },
})
