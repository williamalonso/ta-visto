import { ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { StatsOverview } from '@/components/StatsOverview'
import { Skeleton } from '@/components/Skeleton'
import { RecentCard } from '@/screens/home/components/RecentCard'
import { ContinueWatchingCard } from '@/screens/home/components/ContinueWatchingCard'
import { styles } from '@/screens/home/styles'
import { radius } from '@/theme'

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
  const recent = allItems.slice(0, 5)
  const watching = allItems.filter((m) => m.status === 'watching')
  const completedCount = allItems.filter((m) => m.status === 'completed').length

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Tá Visto</Text>
            <Text style={styles.greeting}>O que está assistindo?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TV</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Resumo</Text>
        {loading ? (
          <View style={styles.statsSkeletonGrid}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.statSkeletonItem}>
                <Skeleton width="100%" height={84} borderRadius={radius.lg} />
              </View>
            ))}
          </View>
        ) : (
          <StatsOverview
            totalMovies={movies.length}
            totalSeries={series.length}
            watching={watching.length}
            completed={completedCount}
          />
        )}

        {watching.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Continue Assistindo</Text>
            {watching.slice(0, 5).map((item) => (
              <ContinueWatchingCard key={item.id} item={item} />
            ))}
          </>
        )}

        {recent.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Recentes</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
            >
              {recent.map((item) => (
                <RecentCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </>
        )}

        {allItems.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum título adicionado ainda.</Text>
            <Text style={styles.emptySubtext}>
              Use a aba Busca para adicionar filmes e séries.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
