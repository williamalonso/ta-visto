import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { MediaItem } from '@/types'
import { RecentCard } from './RecentCard'
import { colors, spacing, typography } from '@/theme'

interface Props {
  items: MediaItem[]
  title: string
  route: '/(tabs)/movies' | '/(tabs)/series'
}

export function RecentSection({ items, title, route }: Props) {
  if (items.length === 0) return null

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={() => router.push(route as any)} hitSlop={8}>
          <Text style={styles.seeAll}>Ver todos ›</Text>
        </Pressable>
      </View>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xxl,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.auxiliary,
    color: colors.primary,
    fontWeight: '600',
  },
})
