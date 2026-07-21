import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { TmdbResult } from '@/types'
import { TmdbCard } from '@/components/TmdbCard'
import { colors, spacing, typography } from '@/theme'

interface Props {
  items: TmdbResult[]
  isAdded: (tmdbId: number) => boolean
  onAdd: (item: TmdbResult) => void
}

const CARD_WIDTH = 100

export function DetailRecommendations({ items, isAdded, onAdd }: Props) {
  if (items.length === 0) return null

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você também pode gostar</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item) => (
          <View key={item.id} style={{ width: CARD_WIDTH }}>
            <TmdbCard
              item={item}
              isAdded={isAdded(item.id)}
              onPress={() =>
                router.push({
                  pathname: '/detail/[id]',
                  params: { id: String(item.id), mediaType: item.mediaType },
                } as any)
              }
              onAdd={() => onAdd(item)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
})
