import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { StatusSelector } from '@/components/StatusSelector'
import { SeasonList } from './SeasonList'
import { DetailBackButton } from './components/DetailBackButton'
import { DetailPosterInfo } from './components/DetailPosterInfo'
import { DetailStatusCard } from './components/DetailStatusCard'
import { DetailOverview } from './components/DetailOverview'
import { useDetail } from './hooks/useDetail'
import { DetailCast } from './components/DetailCast'
import { colors, spacing } from '@/theme'

export default function DetailScreen() {
  const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: string }>()
  const [statusSelectorVisible, setStatusSelectorVisible] = useState(false)

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
    cast,
    directors,
    creators,
  } = useDetail(id, mediaType)

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
        <DetailBackButton />
        <DetailPosterInfo item={item} genres={genres} runtime={runtime} detailLoading={detailLoading} />
        <DetailStatusCard item={item} onPress={() => setStatusSelectorVisible(true)} />
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
                onToggleEpisode={handleToggleEpisode}
                onMarkEpisodes={handleMarkEpisodes}
                onUnmarkEpisodes={handleUnmarkEpisodes}
              />
            ) : null}
          </View>
        )}
      </ScrollView>

      <StatusSelector
        visible={statusSelectorVisible}
        mediaType={item.mediaType}
        onSelect={async (status) => {
          await handleStatusChange(status)
          setStatusSelectorVisible(false)
        }}
        onClose={() => setStatusSelectorVisible(false)}
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
  section: {
    marginTop: spacing.md,
  },
})
