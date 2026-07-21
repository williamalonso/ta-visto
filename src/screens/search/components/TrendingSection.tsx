import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { TmdbResult } from '@/types'
import { colors, radius, spacing, typography } from '@/theme'
import { TmdbCard } from '@/components/TmdbCard'
import { TrendingMoreModal } from './TrendingMoreModal'

const CARD_WIDTH = 110

function SeeMoreCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.seeMoreCard, pressed && { opacity: 0.75 }]} onPress={onPress}>
      <View style={styles.seeMoreInner}>
        <Text style={styles.seeMoreArrow}>›</Text>
        <Text style={styles.seeMoreLabel}>Ver{'\n'}mais</Text>
      </View>
    </Pressable>
  )
}

interface SectionProps {
  title: string
  items: TmdbResult[]
  mediaType: 'movie' | 'tv'
  isAdded: (id: number) => boolean
  onPress: (item: TmdbResult) => void
  onAdd: (item: TmdbResult) => void
}

function TrendingRow({ title, items, mediaType, isAdded, onPress, onAdd }: SectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  if (items.length === 0) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <View key={item.id} style={{ width: CARD_WIDTH }}>
            <TmdbCard
              testID="trending-card"
              addTestID="trending-add-btn"
              item={item}
              isAdded={isAdded(item.id)}
              onPress={() => onPress(item)}
              onAdd={() => onAdd(item)}
            />
          </View>
        ))}
        <SeeMoreCard onPress={() => setModalOpen(true)} />
      </ScrollView>

      <TrendingMoreModal
        mediaType={mediaType}
        visible={modalOpen}
        isAdded={isAdded}
        onAdd={onAdd}
        onPress={onPress}
        onClose={() => setModalOpen(false)}
      />
    </View>
  )
}

interface Props {
  movies: TmdbResult[]
  series: TmdbResult[]
  loading: boolean
  isAdded: (id: number, mediaType: 'movie' | 'tv') => boolean
  onAdd: (item: TmdbResult) => void
  onPress: (item: TmdbResult) => void
}

export function TrendingSection({ movies, series, loading, isAdded, onAdd, onPress }: Props) {
  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Em alta agora</Text>
      <TrendingRow title="Filmes" items={movies} mediaType="movie" isAdded={(id) => isAdded(id, 'movie')} onPress={onPress} onAdd={onAdd} />
      <TrendingRow title="Séries" items={series} mediaType="tv" isAdded={(id) => isAdded(id, 'tv')} onPress={onPress} onAdd={onAdd} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  seeMoreCard: {
    width: CARD_WIDTH,
    gap: spacing.xs,
  },
  seeMoreInner: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  seeMoreArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 36,
  },
  seeMoreLabel: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
})
