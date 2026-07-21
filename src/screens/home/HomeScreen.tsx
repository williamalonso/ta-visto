import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { colors, spacing } from '@/theme'
import { HomeHeader } from './components/HomeHeader'
import { StatsSummary } from './components/StatsSummary'
import { ContinueWatchingSection } from './components/ContinueWatchingSection'
import { RecentSection } from './components/RecentSection'
import { HomeEmptyState } from './components/HomeEmptyState'
import { CompletedModal } from './components/CompletedModal'
import { WatchingModal } from './components/WatchingModal'
import { WatchProvidersModal } from './components/WatchProvidersModal'
import { SpotlightCard } from './components/SpotlightCard'
import { MediaItem } from '@/types'

export default function HomeScreen() {
  const { movies, loading: moviesLoading, reload: reloadMovies } = useMovies()
  const { series, loading: seriesLoading, reload: reloadSeries } = useSeries()
  const loading = moviesLoading || seriesLoading

  useFocusEffect(
    useCallback(() => {
      reloadMovies()
      reloadSeries()
    }, [reloadMovies, reloadSeries])
  )

  const [completedVisible, setCompletedVisible] = useState(false)
  const [watchingVisible, setWatchingVisible] = useState(false)
  const [spotlightProviderItem, setSpotlightProviderItem] = useState<MediaItem | null>(null)

  const byDate = (a: { updatedAt: string }, b: { updatedAt: string }) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()

  const allItems = [...movies, ...series].sort(byDate)
  const recentMovies = [...movies].sort(byDate).slice(0, 5)
  const recentSeries = [...series].sort(byDate).slice(0, 5)
  const watching = allItems.filter((m) => m.status === 'watching')
  const watchingMovies = movies.filter((m) => m.status === 'watching').sort(byDate)
  const watchingSeries = series.filter((s) => s.status === 'watching').sort(byDate)
  const completedMovies = movies.filter((m) => m.status === 'completed').sort(byDate)
  const completedSeries = series.filter((s) => s.status === 'completed').sort(byDate)
  const completedCount = completedMovies.length + completedSeries.length

  const spotlightItem = watching[0] ?? null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader totalCount={allItems.length} />

        {spotlightItem && (
          <SpotlightCard
            item={spotlightItem}
            onContinue={() => setSpotlightProviderItem(spotlightItem)}
          />
        )}

        <StatsSummary
          loading={loading}
          totalMovies={movies.length}
          totalSeries={series.length}
          watching={watching.length}
          completed={completedCount}
          onWatchingPress={() => setWatchingVisible(true)}
          onCompletedPress={() => setCompletedVisible(true)}
        />

        <ContinueWatchingSection items={watching} />
        <RecentSection title="Filmes Recentes" items={recentMovies} route="/(tabs)/movies" />
        <RecentSection title="Séries Recentes" items={recentSeries} route="/(tabs)/series" />
        {allItems.length === 0 && !loading && <HomeEmptyState />}
      </ScrollView>

      <WatchProvidersModal
        visible={!!spotlightProviderItem}
        item={spotlightProviderItem}
        onClose={() => setSpotlightProviderItem(null)}
      />

      <WatchingModal
        visible={watchingVisible}
        movies={watchingMovies}
        series={watchingSeries}
        onClose={() => setWatchingVisible(false)}
      />

      <CompletedModal
        visible={completedVisible}
        movies={completedMovies}
        series={completedSeries}
        onClose={() => setCompletedVisible(false)}
      />
    </SafeAreaView>
  )
}
