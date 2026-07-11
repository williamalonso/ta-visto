import { ScrollView, View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, router } from 'expo-router'
import { useCallback } from 'react'
import { SymbolView } from 'expo-symbols'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { StatsOverview } from '@/components/StatsOverview'
import { Skeleton } from '@/components/Skeleton'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors, spacing, typography, radius, shadows } from '@/theme'

function RecentCard({ item }: { item: MediaItem }) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''

  return (
    <View style={recentStyles.card}>
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={recentStyles.poster} resizeMode="cover" />
      ) : (
        <View style={recentStyles.posterPlaceholder}>
          <Text style={recentStyles.placeholderEmoji}>🎬</Text>
        </View>
      )}
      <Text style={recentStyles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={recentStyles.year}>{year}</Text>
    </View>
  )
}

const recentStyles = StyleSheet.create({
  card: {
    width: 72,
    marginRight: spacing.md,
  },
  poster: {
    width: 72,
    height: 108,
    borderRadius: radius.md,
  },
  posterPlaceholder: {
    width: 72,
    height: 108,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 24,
  },
  title: {
    ...typography.auxiliary,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  year: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
  },
})

function ContinueWatchingCard({ item }: { item: MediaItem }) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  const destination = item.mediaType === 'movie' ? '/(tabs)/movies' : '/(tabs)/series'

  return (
    <Pressable
      style={({ pressed }) => [cwStyles.card, pressed && cwStyles.pressed]}
      onPress={() => router.push(destination as any)}
    >
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={cwStyles.poster} resizeMode="cover" />
      ) : (
        <View style={cwStyles.posterPlaceholder}>
          <Text style={cwStyles.placeholderEmoji}>🎬</Text>
        </View>
      )}
      <View style={cwStyles.info}>
        <Text style={cwStyles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={cwStyles.type}>{item.mediaType === 'movie' ? 'Filme' : 'Série'}</Text>
      </View>
      <View style={cwStyles.playButton}>
        <SymbolView
          name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
          size={14}
          tintColor={colors.white}
        />
      </View>
    </Pressable>
  )
}

const cwStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  poster: {
    width: 48,
    height: 72,
    borderRadius: radius.sm,
  },
  posterPlaceholder: {
    width: 48,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  type: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function DashboardScreen() {
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.auxiliary,
    fontWeight: '700',
    color: colors.white,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionTitleSpaced: {
    marginTop: spacing.xxl,
  },
  statsSkeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statSkeletonItem: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  recentList: {
    paddingRight: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
})
