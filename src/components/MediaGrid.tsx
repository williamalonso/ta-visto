import { View, Text, FlatList, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { MediaCard } from '@/components/MediaCard'
import { colors, spacing, typography } from '@/theme'
import { MediaItem, MediaStatus } from '@/types'
import { SectionRow, STATUS_LABELS, SortOrder, buildSectionRows, chunkItems, sortItems } from '@/utils/groupByStatus'
import { useCardWidth } from '@/hooks/useCardWidth'

const NUM_COLUMNS = 3

type Props = {
  items: MediaItem[]
  filter: MediaStatus | 'all'
  sort: SortOrder
  onStatusPress: (item: MediaItem) => void
  onRemove: (id: string) => void
  ListEmptyComponent?: React.ReactElement
  ListHeaderComponent?: React.ReactElement
}

export function MediaGrid({ items, filter, sort, onStatusPress, onRemove, ListEmptyComponent, ListHeaderComponent }: Props) {
  const cardWidth = useCardWidth()

  const rows: SectionRow[] = filter === 'all'
    ? buildSectionRows(items, NUM_COLUMNS, sort)
    : chunkItems(sortItems(items, sort), NUM_COLUMNS, 'filtered')

  return (
    <FlatList
      data={rows}
      keyExtractor={(item, i) => item.type === 'header' ? `h-${item.status}` : item.key ?? String(i)}
      contentContainerStyle={{ paddingBottom: spacing.xxxl }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          {ListHeaderComponent ?? null}
          {filter !== 'all' ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{STATUS_LABELS[filter]}</Text>
              <View style={styles.divider} />
            </View>
          ) : null}
        </>
      }
      ListEmptyComponent={ListEmptyComponent}
      renderItem={({ item: row }) => {
        if (row.type === 'header') {
          return (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{row.label}</Text>
              <View style={styles.divider} />
            </View>
          )
        }
        return (
          <View style={styles.row}>
            {row.items.map((item) => (
              <View key={item.id} style={{ width: cardWidth }}>
                <MediaCard
                  item={item}
                  onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id, mediaType: item.mediaType } })}
                  onStatusPress={() => onStatusPress(item)}
                  onRemove={onRemove}
                />
              </View>
            ))}
            {row.items.length < NUM_COLUMNS && Array.from({ length: NUM_COLUMNS - row.items.length }).map((_, i) => (
              <View key={`spacer-${i}`} style={{ width: cardWidth }} />
            ))}
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
})
