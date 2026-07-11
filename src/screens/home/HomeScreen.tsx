import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { colors, spacing } from '@/theme'
import { HomeHeader } from './components/HomeHeader'
import { StatsSummary } from './components/StatsSummary'
import { ContinueWatchingSection } from './components/ContinueWatchingSection'
import { RecentSection } from './components/RecentSection'
import { HomeEmptyState } from './components/HomeEmptyState'

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

  const allItems = [...movies, ...series].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  const watching = allItems.filter((m) => m.status === 'watching')
  const completedCount = allItems.filter((m) => m.status === 'completed').length

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
        />
        <ContinueWatchingSection items={watching} />
        <RecentSection items={allItems.slice(0, 5)} />
        {allItems.length === 0 && !loading && <HomeEmptyState />}
      </ScrollView>
    </SafeAreaView>
  )
}
