import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { Chip } from '@/components/Chip'
import { MediaStatus } from '@/types'
import { SortOrder } from '@/utils/groupByStatus'
import { colors, spacing, typography, radius } from '@/theme'

const STATUS_FILTERS: Array<{ value: MediaStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'watching', label: 'Assistindo' },
  { value: 'plan_to_watch', label: 'Pretendo' },
  { value: 'on_hold', label: 'Pausado' },
  { value: 'up_to_date', label: 'Em dia' },
  { value: 'completed', label: 'Finalizado' },
]

interface Props {
  count: number
  filter: MediaStatus | 'all'
  sort: SortOrder
  onFilterChange: (filter: MediaStatus | 'all') => void
  onSortChange: (sort: SortOrder) => void
}

export function SeriesHeader({ count, filter, sort, onFilterChange, onSortChange }: Props) {
  return (
    <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md, gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Séries</Text>
        <Text style={{ ...typography.body, color: colors.textSecondary, backgroundColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill }}>
          {count}
        </Text>
      </View>
      <View style={styles.row}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {STATUS_FILTERS.map((f) => (
            <Chip key={f.value} label={f.label} active={filter === f.value} onPress={() => onFilterChange(f.value)} />
          ))}
        </ScrollView>
        <View style={styles.sortBtns}>
          <Pressable onPress={() => onSortChange('recent')} style={[styles.sortBtn, sort === 'recent' && styles.sortBtnActive]}>
            <Text style={[styles.sortText, sort === 'recent' && styles.sortTextActive]}>Recentes</Text>
          </Pressable>
          <Pressable onPress={() => onSortChange('alpha')} style={[styles.sortBtn, sort === 'alpha' && styles.sortBtnActive]}>
            <Text style={[styles.sortText, sort === 'alpha' && styles.sortTextActive]}>A–Z</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sortBtns: {
    flexDirection: 'row',
    gap: 2,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: 2,
  },
  sortBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  sortBtnActive: {
    backgroundColor: colors.surface,
  },
  sortText: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortTextActive: {
    color: colors.textPrimary,
  },
})
