import { ScrollView, Text } from 'react-native'
import { MediaItem } from '@/types'
import { RecentCard } from './RecentCard'
import { colors, spacing, typography } from '@/theme'

interface Props {
  items: MediaItem[]
}

export function RecentSection({ items }: Props) {
  if (items.length === 0) return null

  return (
    <>
      <Text style={{ ...typography.sectionTitle, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.xxl }}>Recentes</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: spacing.xl }}
      >
        {items.map((item) => (
          <RecentCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </>
  )
}
