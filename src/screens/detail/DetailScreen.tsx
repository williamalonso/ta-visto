import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { StatusSelector } from '@/components/StatusSelector'
import { SeasonList } from './SeasonList'
import { DetailBackButton } from './components/DetailBackButton'
import { DetailPosterInfo } from './components/DetailPosterInfo'
import { DetailStatusCard } from './components/DetailStatusCard'
import { DetailOverview } from './components/DetailOverview'
import { useDetail } from './hooks/useDetail'
import { DetailCast } from './components/DetailCast'
import { DetailRecommendations } from './components/DetailRecommendations'
import { SymbolView } from 'expo-symbols'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { WatchProvidersModal } from '@/components/WatchProvidersModal'
import { useMovies } from '@/hooks/useMovies'
import { useSeries } from '@/hooks/useSeries'
import { TmdbResult } from '@/types'
import { colors, spacing, radius, typography } from '@/theme'

export default function DetailScreen() {
  const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: string }>()
  const [statusSelectorVisible, setStatusSelectorVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [pendingEpisodeKeys, setPendingEpisodeKeys] = useState<string[] | null>(null)
  const [pendingRecommendation, setPendingRecommendation] = useState<TmdbResult | null>(null)
  const [watchProvidersVisible, setWatchProvidersVisible] = useState(false)

  const { exists: movieExists, add: addMovie, reload: reloadMovies } = useMovies()
  const { exists: seriesExists, add: addSeries, reload: reloadSeries } = useSeries()

  useFocusEffect(
    useCallback(() => {
      reloadMovies()
      reloadSeries()
    }, [reloadMovies, reloadSeries])
  )

  const {
    item,
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
    isPreview,
    cast,
    directors,
    creators,
    recommendations,
  } = useDetail(id, mediaType)

  const isRecommendationAdded = useCallback(
    (tmdbId: number) =>
      mediaType === 'movie' ? movieExists(tmdbId) : seriesExists(tmdbId),
    [mediaType, movieExists, seriesExists]
  )

  if (!item) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <DetailBackButton />
          {!isPreview && <Pressable
            testID="detail-remove-btn"
            style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
            onPress={() => setDeleteModalVisible(true)}
          >
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              size={22}
              tintColor={colors.error}
            />
          </Pressable>}
        </View>
        <DetailPosterInfo item={item} genres={genres} runtime={runtime} detailLoading={detailLoading} />
        {isPreview ? (
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.8 }]}
            onPress={() => setStatusSelectorVisible(true)}
          >
            <Text style={styles.addBtnText}>+ Adicionar à lista</Text>
          </Pressable>
        ) : (
          <DetailStatusCard item={item} onPress={() => setStatusSelectorVisible(true)} />
        )}
        <Pressable
          style={({ pressed }) => [styles.watchProvidersBtn, pressed && { opacity: 0.7 }]}
          onPress={() => setWatchProvidersVisible(true)}
        >
          <SymbolView
            name={{ ios: 'play.circle', android: 'play_circle', web: 'play_circle' }}
            size={18}
            tintColor={colors.textSecondary}
          />
          <Text style={styles.watchProvidersBtnText}>Onde assistir</Text>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'arrow_forward_ios', web: 'chevron_right' }}
            size={14}
            tintColor={colors.textAuxiliary}
          />
        </Pressable>
        {item.overview ? <DetailOverview overview={item.overview} /> : null}
        <DetailCast cast={cast} directors={directors} creators={creators} />
        {item.mediaType === 'tv' && (
          <View style={styles.section}>
            {detailLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : tvDetail && tvDetail.seasons.length > 0 ? (
              <SeasonList
                seasons={tvDetail.seasons}
                tmdbId={item.tmdbId}
                watchedEpisodes={item.watchedEpisodes ?? []}
                onToggleEpisode={(key) => {
                  if (isPreview) {
                    setPendingEpisodeKeys([key])
                    setStatusSelectorVisible(true)
                  } else {
                    handleToggleEpisode(key)
                  }
                }}
                onMarkEpisodes={(keys) => {
                  if (isPreview) {
                    setPendingEpisodeKeys(keys)
                    setStatusSelectorVisible(true)
                  } else {
                    handleMarkEpisodes(keys)
                  }
                }}
                onUnmarkEpisodes={handleUnmarkEpisodes}
              />
            ) : null}
          </View>
        )}
        <DetailRecommendations
          items={recommendations}
          isAdded={isRecommendationAdded}
          onAdd={(rec) => {
            setPendingRecommendation(rec)
            setStatusSelectorVisible(true)
          }}
        />
      </ScrollView>

      <WatchProvidersModal
        visible={watchProvidersVisible}
        item={item}
        onClose={() => setWatchProvidersVisible(false)}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        title={item.title}
        onConfirm={handleRemove}
        onClose={() => setDeleteModalVisible(false)}
      />

      <StatusSelector
        visible={statusSelectorVisible}
        mediaType={pendingRecommendation?.mediaType ?? item.mediaType}
        onSelect={async (status) => {
          if (pendingRecommendation) {
            const rec = pendingRecommendation
            const base = {
              tmdbId: rec.id,
              mediaType: rec.mediaType,
              title: rec.title,
              posterPath: rec.posterPath,
              backdropPath: rec.backdropPath ?? null,
              overview: rec.overview,
              releaseDate: rec.releaseDate,
              voteAverage: rec.voteAverage,
              status,
              rating: null as null,
              notes: null as null,
            }
            if (rec.mediaType === 'movie') await addMovie(base)
            else await addSeries(base)
            setPendingRecommendation(null)
          } else if (isPreview) {
            await handleAdd(status, pendingEpisodeKeys ?? undefined)
          } else {
            await handleStatusChange(status)
          }
          setPendingEpisodeKeys(null)
          setStatusSelectorVisible(false)
        }}
        onClose={() => {
          setPendingEpisodeKeys(null)
          setPendingRecommendation(null)
          setStatusSelectorVisible(false)
        }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  deleteBtn: {
    padding: spacing.sm,
  },
  section: {
    marginTop: spacing.md,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addBtnText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
  },
  watchProvidersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  watchProvidersBtnText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
})
