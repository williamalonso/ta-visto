import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { getMovieDetails, getTvDetails, TmdbMovieDetail, TmdbTvDetail, TmdbCastMember } from '@/lib/tmdb'
import { MediaItem, MediaStatus, TmdbResult } from '@/types'

function buildPreviewItem(tmdbId: number, mediaType: 'movie' | 'tv', detail: TmdbMovieDetail | TmdbTvDetail): MediaItem {
  const isMovie = mediaType === 'movie'
  const d = detail as any
  return {
    id: String(tmdbId),
    tmdbId,
    mediaType,
    title: isMovie ? d.title : d.name,
    posterPath: d.poster_path,
    overview: d.overview,
    releaseDate: isMovie ? d.release_date : d.first_air_date,
    voteAverage: d.vote_average,
    status: 'plan_to_watch',
    rating: null,
    notes: null,
    createdAt: '',
    updatedAt: '',
  }
}

export function useDetail(id: string, mediaType: string) {
  const { movies, updateStatus: updateMovieStatus, update: updateMovie, remove: removeMovie, add: addMovie } = useMovies()
  const { series, updateStatus: updateSeriesStatus, update: updateSeries, remove: removeSeries, add: addSeries } = useSeries()

  const tmdbId = Number(id)
  const isPreview = !isNaN(tmdbId) && String(tmdbId) === id

  const localItem: MediaItem | undefined = isPreview
    ? (mediaType === 'movie' ? movies.find((m) => m.tmdbId === tmdbId) : series.find((s) => s.tmdbId === tmdbId))
    : (mediaType === 'movie' ? movies.find((m) => m.id === id) : series.find((s) => s.id === id))

  const [tmdbDetail, setTmdbDetail] = useState<TmdbMovieDetail | TmdbTvDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)

  const resolvedTmdbId = localItem?.tmdbId ?? (isPreview ? tmdbId : null)

  useEffect(() => {
    if (!resolvedTmdbId) return
    setDetailLoading(true)
    const fetch = mediaType === 'movie'
      ? getMovieDetails(resolvedTmdbId)
      : getTvDetails(resolvedTmdbId)
    fetch.then((detail) => {
      setTmdbDetail(detail)
      if (!localItem) {
        setPreviewItem(buildPreviewItem(resolvedTmdbId, mediaType as 'movie' | 'tv', detail))
      }
    }).finally(() => setDetailLoading(false))
  }, [resolvedTmdbId])

  const item = localItem ?? previewItem ?? undefined

  const handleStatusChange = async (status: MediaStatus) => {
    if (!localItem) return
    if (localItem.mediaType === 'movie') {
      await updateMovieStatus(localItem.id, status)
    } else {
      if (status === 'completed' && tvDetail) {
        const allKeys = tvDetail.seasons
          .filter((s) => s.season_number > 0)
          .flatMap((s) =>
            Array.from({ length: s.episode_count }, (_, i) => `${s.season_number}-${i + 1}`)
          )
        const merged = [...new Set([...(localItem.watchedEpisodes ?? []), ...allKeys])]
        await updateSeries(localItem.id, { status, watchedEpisodes: merged })
      } else {
        await updateSeriesStatus(localItem.id, status)
      }
    }
  }

  const autoStatusOnMark = (next: string[]): MediaStatus | null => {
    if (!tvDetail) return null
    const allKeys = tvDetail.seasons
      .filter((s) => s.season_number > 0)
      .flatMap((s) =>
        Array.from({ length: s.episode_count }, (_, i) => `${s.season_number}-${i + 1}`)
      )
    if (allKeys.length === 0 || !allKeys.every((k) => next.includes(k))) return null
    const ended = tvDetail.status === 'Ended' || tvDetail.status === 'Canceled'
    return ended ? 'completed' : 'up_to_date'
  }

  const seriesChanges = (next: string[], unmarking: boolean): Partial<MediaItem> => {
    const changes: Partial<MediaItem> = { watchedEpisodes: next }
    if (!localItem) return changes
    if (unmarking) {
      changes.status = 'watching'
    } else {
      const auto = autoStatusOnMark(next)
      if (auto) changes.status = auto
    }
    return changes
  }

  const handleToggleEpisode = async (key: string) => {
    if (!localItem) return
    const current = localItem.watchedEpisodes ?? []
    const unmarking = current.includes(key)
    const next = unmarking ? current.filter((k) => k !== key) : [...current, key]
    if (localItem.mediaType === 'movie') await updateMovie(localItem.id, { watchedEpisodes: next })
    else await updateSeries(localItem.id, seriesChanges(next, unmarking))
  }

  const handleMarkEpisodes = async (keys: string[]) => {
    if (!localItem) return
    const current = localItem.watchedEpisodes ?? []
    const next = [...new Set([...current, ...keys])]
    if (localItem.mediaType === 'movie') await updateMovie(localItem.id, { watchedEpisodes: next })
    else await updateSeries(localItem.id, seriesChanges(next, false))
  }

  const handleUnmarkEpisodes = async (keys: string[]) => {
    if (!localItem) return
    const current = localItem.watchedEpisodes ?? []
    const next = current.filter((k) => !keys.includes(k))
    if (localItem.mediaType === 'movie') await updateMovie(localItem.id, { watchedEpisodes: next })
    else await updateSeries(localItem.id, seriesChanges(next, true))
  }

  const handleAdd = async (status: MediaStatus, watchedEpisodes?: string[]) => {
    if (!previewItem) return
    let resolvedEpisodes = watchedEpisodes
    if (status === 'completed' && previewItem.mediaType === 'tv' && tvDetail) {
      const allKeys = tvDetail.seasons
        .filter((s) => s.season_number > 0)
        .flatMap((s) =>
          Array.from({ length: s.episode_count }, (_, i) => `${s.season_number}-${i + 1}`)
        )
      resolvedEpisodes = [...new Set([...(watchedEpisodes ?? []), ...allKeys])]
    }
    const base = {
      tmdbId: previewItem.tmdbId,
      mediaType: previewItem.mediaType,
      title: previewItem.title,
      posterPath: previewItem.posterPath,
      overview: previewItem.overview,
      releaseDate: previewItem.releaseDate,
      voteAverage: previewItem.voteAverage,
      status,
      rating: null as null,
      notes: null as null,
      ...(resolvedEpisodes?.length ? { watchedEpisodes: resolvedEpisodes } : {}),
    }
    if (previewItem.mediaType === 'movie') await addMovie(base)
    else await addSeries(base)
  }

  const handleRemove = async () => {
    if (!localItem) return
    if (localItem.mediaType === 'movie') await removeMovie(localItem.id)
    else await removeSeries(localItem.id)
    router.back()
  }

  const genres =
    tmdbDetail && 'genres' in tmdbDetail
      ? tmdbDetail.genres.map((g) => g.name).join(', ')
      : null

  const runtime =
    tmdbDetail && 'runtime' in tmdbDetail && tmdbDetail.runtime
      ? `${tmdbDetail.runtime} min`
      : null

  const tvDetail =
    item?.mediaType === 'tv' && tmdbDetail ? (tmdbDetail as TmdbTvDetail) : null

  const cast: TmdbCastMember[] = tmdbDetail?.credits?.cast?.slice(0, 8) ?? []

  const directors =
    tmdbDetail && 'credits' in tmdbDetail
      ? tmdbDetail.credits.crew.filter((c) => c.job === 'Director').map((c) => c.name)
      : []

  const creators = tvDetail?.created_by?.map((c) => c.name) ?? []

  return {
    item,
    isPreview: isPreview && !localItem,
    detailLoading,
    genres,
    runtime,
    tvDetail,
    handleStatusChange,
    handleToggleEpisode,
    handleMarkEpisodes,
    handleUnmarkEpisodes,
    handleRemove,
    handleAdd,
    cast,
    directors,
    creators,
  }
}
