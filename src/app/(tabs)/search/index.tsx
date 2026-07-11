import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useCallback } from 'react'
import { Chip } from '@/components/Chip'
import { SearchBar } from '@/components/SearchBar'
import { SearchResults } from '@/components/SearchResults'
import { StatusSelector } from '@/components/StatusSelector'
import { useSearch } from './hooks/useSearch'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { TmdbResult, MediaStatus } from '@/types'
import { styles } from './styles'

export default function SearchScreen() {
  const { query, setQuery, mediaType, setMediaType, results, loading, error } = useSearch()
  const { exists: movieExists, add: addMovie } = useMovies()
  const { exists: seriesExists, add: addSeries } = useSeries()
  const [pendingItem, setPendingItem] = useState<TmdbResult | null>(null)

  const isAdded = useCallback(
    (tmdbId: number) => (mediaType === 'movie' ? movieExists(tmdbId) : seriesExists(tmdbId)),
    [mediaType, movieExists, seriesExists]
  )

  const handleAdd = (item: TmdbResult) => {
    if (isAdded(item.id)) return
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Busca</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar filmes e séries..."
        />
        <View style={styles.chips}>
          <Chip label="Filme" active={mediaType === 'movie'} onPress={() => setMediaType('movie')} />
          <Chip label="Série" active={mediaType === 'tv'} onPress={() => setMediaType('tv')} />
        </View>
      </View>

      {!hasQuery && (
        <View style={styles.emptyPrompt}>
          <Text style={styles.emptyText}>Digite algo para buscar</Text>
        </View>
      )}

      {showNoResults && (
        <View style={styles.emptyPrompt}>
          <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
        </View>
      )}

      {hasQuery && (loading || results.length > 0 || error !== null) && (
        <View style={styles.resultsContainer}>
          <SearchResults
            results={results}
            loading={loading}
            error={error}
            isAdded={isAdded}
            onAdd={handleAdd}
          />
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
