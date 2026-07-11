import { View, Text, ScrollView } from 'react-native'
import { Chip } from '@/components/Chip'
import { MediaStatus } from '@/types'
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
  onFilterChange: (filter: MediaStatus | 'all') => void
}

export function MoviesHeader({ count, filter, onFilterChange }: Props) {
  return (
    <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md, gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Filmes</Text>
        <Text style={{ ...typography.body, color: colors.textSecondary, backgroundColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill }}>
          {count}
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {STATUS_FILTERS.map((f) => (
          <Chip key={f.value} label={f.label} active={filter === f.value} onPress={() => onFilterChange(f.value)} />
        ))}
      </ScrollView>
    </View>
  )
}
