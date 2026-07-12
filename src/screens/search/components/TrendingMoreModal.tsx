import { Modal, View, Text, FlatList, Pressable, Image, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'
import { useEffect, useState } from 'react'
import { getTrending } from '@/lib/tmdb'
import { TmdbResult } from '@/types'
import { POSTER_BASE_URL } from '@/lib/tmdb'
import { colors, radius, spacing, typography, shadows } from '@/theme'
import { useCardWidth } from '@/hooks/useCardWidth'

interface Props {
  mediaType: 'movie' | 'tv'
  visible: boolean
  isAdded: (id: number) => boolean
  onAdd: (item: TmdbResult) => void
  onPress: (item: TmdbResult) => void
  onClose: () => void
}

function MoreCard({ item, isAdded, onPress, onAdd }: { item: TmdbResult; isAdded: boolean; onPress: () => void; onAdd: () => void }) {
  const posterUrl = item.posterPath ? `${POSTER_BASE_URL}${item.posterPath}` : null
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]} onPress={onPress}>
      <View style={styles.posterContainer}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
          </View>
        )}
        <Pressable
          style={[styles.badge, isAdded && styles.badgeAdded]}
          onPress={(e) => { e.stopPropagation?.(); if (!isAdded) onAdd() }}
          hitSlop={6}
        >
          <Text style={styles.badgeText}>{isAdded ? '✓' : '+'}</Text>
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
    </Pressable>
  )
}

export function TrendingMoreModal({ mediaType, visible, isAdded, onAdd, onPress, onClose }: Props) {
  const [items, setItems] = useState<TmdbResult[]>([])
  const [loading, setLoading] = useState(false)
  const cardWidth = useCardWidth()

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    getTrending(mediaType, 2)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [visible, mediaType])

  const label = mediaType === 'movie' ? 'Filmes em Alta' : 'Séries em Alta'

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>{label}</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.closeBtn}>Fechar</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ width: cardWidth }}>
                <MoreCard
                  item={item}
                  isAdded={isAdded(item.id)}
                  onPress={() => { onPress(item); onClose() }}
                  onAdd={() => onAdd(item)}
                />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  closeBtn: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  card: {
    gap: spacing.xs,
    ...shadows.sm,
  },
  posterContainer: {
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 20,
    color: colors.textAuxiliary,
  },
  badge: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAdded: {
    backgroundColor: colors.success,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 16,
  },
  title: {
    ...typography.auxiliary,
    color: colors.textPrimary,
    fontWeight: '500',
  },
})
