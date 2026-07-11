import { Text } from 'react-native'
import { MediaItem } from '@/types'
import { ContinueWatchingCard } from './ContinueWatchingCard'
import { colors, spacing, typography } from '@/theme'

interface Props {
  items: MediaItem[]
}

export function ContinueWatchingSection({ items }: Props) {
  if (items.length === 0) return null

  return (
    <>
      <Text style={{ ...typography.sectionTitle, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.xxl }}>Continue Assistindo</Text>
      {items.slice(0, 5).map((item) => (
        <ContinueWatchingCard key={item.id} item={item} />
      ))}
    </>
  )
}
