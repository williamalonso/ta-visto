import { View, ScrollView, ActivityIndicator, StyleSheet, Pressable } from 'react-native'
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
import { SymbolView } from 'expo-symbols'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { colors, spacing } from '@/theme'

export default function DetailScreen() {
  const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: string }>()
  const [statusSelectorVisible, setStatusSelectorVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

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
        <View style={styles.header}>
          <DetailBackButton />
          <Pressable
            style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
            onPress={() => setDeleteModalVisible(true)}
          >
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              size={22}
              tintColor={colors.error}
            />
          </Pressable>
        </View>
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

      <DeleteConfirmModal
        visible={deleteModalVisible}
        title={item.title}
        onConfirm={handleRemove}
        onClose={() => setDeleteModalVisible(false)}
      />

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
})
