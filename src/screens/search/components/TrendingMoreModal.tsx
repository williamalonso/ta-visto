import { Modal, View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'
import { useEffect, useState } from 'react'
import { getTrending } from '@/lib/tmdb'
import { TmdbResult } from '@/types'
import { colors, spacing, typography } from '@/theme'
import { useCardWidth } from '@/hooks/useCardWidth'
import { TmdbCard } from '@/components/TmdbCard'

interface Props {
  mediaType: 'movie' | 'tv'
  visible: boolean
  isAdded: (id: number) => boolean
  onAdd: (item: TmdbResult) => void
  onPress: (item: TmdbResult) => void
  onClose: () => void
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
                <TmdbCard
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
})
