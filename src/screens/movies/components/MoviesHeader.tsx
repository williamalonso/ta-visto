import { useRef } from 'react'
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
  { value: 'completed', label: 'Finalizado' },
]

interface Props {
  count: number
  filter: MediaStatus | 'all'
  sort: SortOrder
  onFilterChange: (filter: MediaStatus | 'all') => void
  onSortChange: (sort: SortOrder) => void
}

export function MoviesHeader({ count, filter, sort, onFilterChange, onSortChange }: Props) {
  const scrollRef = useRef<ScrollView>(null)
  const chipLayouts = useRef<Partial<Record<string, { x: number; width: number }>>>({})
  const viewportWidth = useRef(0)

  function handleFilter(value: MediaStatus | 'all') {
    onFilterChange(value)
    const chip = chipLayouts.current[value]
    if (!chip) return
    const target = chip.x - (viewportWidth.current - chip.width) / 2
    scrollRef.current?.scrollTo({ x: Math.max(0, target), animated: true })
  }

  return (
    <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md, gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Filmes</Text>
        <Text style={{ ...typography.body, color: colors.textSecondary, backgroundColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill }}>
          {count}
        </Text>
      </View>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }} onLayout={(e) => { viewportWidth.current = e.nativeEvent.layout.width }}>
        {STATUS_FILTERS.map((f) => (
          <View key={f.value} onLayout={(e) => { chipLayouts.current[f.value] = { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width } }}>
            <Chip label={f.label} active={filter === f.value} onPress={() => handleFilter(f.value)} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.row}>
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
