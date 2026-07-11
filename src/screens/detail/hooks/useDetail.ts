import { useEffect, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { getMovieDetails, getTvDetails, TmdbMovieDetail, TmdbTvDetail } from '@/lib/tmdb'
import { MediaItem, MediaStatus } from '@/types'

export function useDetail(id: string, mediaType: string) {
  const { movies, updateStatus: updateMovieStatus, update: updateMovie } = useMovies()
  const { series, updateStatus: updateSeriesStatus, update: updateSeries } = useSeries()

  const item: MediaItem | undefined =
    mediaType === 'movie'
      ? movies.find((m) => m.id === id)
      : series.find((s) => s.id === id)

  const [tmdbDetail, setTmdbDetail] = useState<TmdbMovieDetail | TmdbTvDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)

  useEffect(() => {
    if (!item) return
    setDetailLoading(true)
    const fetch = item.mediaType === 'movie'
      ? getMovieDetails(item.tmdbId)
      : getTvDetails(item.tmdbId)
    fetch.then(setTmdbDetail).finally(() => setDetailLoading(false))
  }, [item?.tmdbId])

  const handleStatusChange = async (status: MediaStatus) => {
    if (!item) return
    if (item.mediaType === 'movie') await updateMovieStatus(item.id, status)
    else await updateSeriesStatus(item.id, status)
  }

  const handleToggleEpisode = async (key: string) => {
    if (!item) return
    const current = item.watchedEpisodes ?? []
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    if (item.mediaType === 'movie') await updateMovie(item.id, { watchedEpisodes: next })
    else await updateSeries(item.id, { watchedEpisodes: next })
  }

  const handleMarkEpisodes = async (keys: string[]) => {
    if (!item) return
    const current = item.watchedEpisodes ?? []
    const next = [...new Set([...current, ...keys])]
    if (item.mediaType === 'movie') await updateMovie(item.id, { watchedEpisodes: next })
    else await updateSeries(item.id, { watchedEpisodes: next })
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

  return {
    item,
    detailLoading,
    genres,
    runtime,
    tvDetail,
    handleStatusChange,
    handleToggleEpisode,
    handleMarkEpisodes,
  }
}
