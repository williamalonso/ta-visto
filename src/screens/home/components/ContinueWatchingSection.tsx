import { useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { MediaItem } from '@/types'
import { ContinueWatchingCard } from './ContinueWatchingCard'
import { WatchProvidersModal } from './WatchProvidersModal'
import { colors, spacing, typography } from '@/theme'

interface Props {
  items: MediaItem[]
}

export function ContinueWatchingSection({ items }: Props) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  if (items.length === 0) return null

  return (
    <>
      <Text style={{ ...typography.sectionTitle, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.xxl }}>
        Continue Assistindo
      </Text>
      <FlatList
        data={items.slice(0, 5)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ marginHorizontal: -spacing.xl }}
        contentContainerStyle={{ paddingHorizontal: spacing.xl }}
        renderItem={({ item, index }) => (
          <ContinueWatchingCard
            item={item}
            index={index}
            onPlayPress={() => setSelectedItem(item)}
          />
        )}
      />
      <WatchProvidersModal
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  )
}
