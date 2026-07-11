import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useCallback } from 'react'
import { router } from 'expo-router'
import { SearchResults } from '@/components/SearchResults'
import { StatusSelector } from '@/components/StatusSelector'
import { useSearch } from './hooks/useSearch'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { TmdbResult, MediaStatus } from '@/types'
import { colors } from '@/theme'
import { SearchHeader } from './components/SearchHeader'
import { SearchEmpty } from './components/SearchEmpty'
import { TrendingSection } from './components/TrendingSection'
import { useTrending } from './hooks/useTrending'

export default function SearchScreen() {
  const { query, setQuery, mediaType, setMediaType, results, loading, error } = useSearch()
  const { movies, exists: movieExists, add: addMovie } = useMovies()
  const { series, exists: seriesExists, add: addSeries } = useSeries()
  const { movies: trendingMovies, series: trendingSeries, loading: trendingLoading } = useTrending()
  const [pendingItem, setPendingItem] = useState<TmdbResult | null>(null)

  const isAdded = useCallback(
    (tmdbId: number) => (mediaType === 'movie' ? movieExists(tmdbId) : seriesExists(tmdbId)),
    [mediaType, movieExists, seriesExists]
  )

  const isTrendingAdded = useCallback(
    (tmdbId: number, type: 'movie' | 'tv') => (type === 'movie' ? movieExists(tmdbId) : seriesExists(tmdbId)),
    [movieExists, seriesExists]
  )

  const handleCardPress = (item: TmdbResult) => {
    const localItem =
      item.mediaType === 'movie'
        ? movies.find((m) => m.tmdbId === item.id)
        : series.find((s) => s.tmdbId === item.id)
    router.push({
      pathname: '/detail/[id]',
      params: { id: localItem ? localItem.id : String(item.id), mediaType: item.mediaType },
    })
  }

  const handleAdd = (item: TmdbResult) => {
    if (isTrendingAdded(item.id, item.mediaType)) return
    setPendingItem(item)
  }

  const handleStatusSelect = async (status: MediaStatus) => {
    if (!pendingItem) return
    const base = {
      tmdbId: pendingItem.id,
      mediaType: pendingItem.mediaType,
      title: pendingItem.title,
      posterPath: pendingItem.posterPath,
      overview: pendingItem.overview,
      releaseDate: pendingItem.releaseDate,
      voteAverage: pendingItem.voteAverage,
      status,
      rating: null as null,
      notes: null as null,
    }
    if (pendingItem.mediaType === 'movie') {
      await addMovie(base)
    } else {
      await addSeries(base)
    }
    setPendingItem(null)
  }

  const hasQuery = query.trim().length > 0
  const showNoResults = hasQuery && !loading && results.length === 0 && error === null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        mediaType={mediaType}
        onMediaTypeChange={setMediaType}
      />

      {!hasQuery && (
        <TrendingSection
          movies={trendingMovies}
          series={trendingSeries}
          loading={trendingLoading}
          isAdded={isTrendingAdded}
          onAdd={handleAdd}
          onPress={handleCardPress}
        />
      )}
      {showNoResults && <SearchEmpty message="Nenhum resultado encontrado" />}

      {hasQuery && (loading || results.length > 0 || error !== null) && (
        <View style={{ flex: 1 }}>
          <SearchResults results={results} loading={loading} error={error} isAdded={isAdded} onAdd={handleAdd} onPress={handleCardPress} />
        </View>
      )}

      <StatusSelector
        visible={pendingItem !== null}
        mediaType={pendingItem?.mediaType ?? 'movie'}
        onSelect={handleStatusSelect}
        onClose={() => setPendingItem(null)}
      />
    </SafeAreaView>
  )
}
