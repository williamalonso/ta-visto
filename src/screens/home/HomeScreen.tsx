import { ScrollView } from 'react-native'
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

  const byDate = (a: { updatedAt: string }, b: { updatedAt: string }) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()

  const allItems = [...movies, ...series].sort(byDate)
  const recentMovies = [...movies].sort(byDate).slice(0, 5)
  const recentSeries = [...series].sort(byDate).slice(0, 5)
  const watching = allItems.filter((m) => m.status === 'watching')
  const completedMovies = movies.filter((m) => m.status === 'completed').sort(byDate)
  const completedSeries = series.filter((s) => s.status === 'completed').sort(byDate)
  const completedCount = completedMovies.length + completedSeries.length

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <StatsSummary
          loading={loading}
          totalMovies={movies.length}
          totalSeries={series.length}
          watching={watching.length}
          completed={completedCount}
          onCompletedPress={() => setCompletedVisible(true)}
        />
        <ContinueWatchingSection items={watching} />
        <RecentSection title="Filmes Recentes" items={recentMovies} />
        <RecentSection title="Séries Recentes" items={recentSeries} />
        {allItems.length === 0 && !loading && <HomeEmptyState />}
      </ScrollView>

      <CompletedModal
        visible={completedVisible}
        movies={completedMovies}
        series={completedSeries}
        onClose={() => setCompletedVisible(false)}
      />
    </SafeAreaView>
  )
}
