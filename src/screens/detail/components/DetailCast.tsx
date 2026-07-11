import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import { TmdbCastMember } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'

const PROFILE_BASE = 'https://image.tmdb.org/t/p/w185'

interface Props {
  cast: TmdbCastMember[]
  directors: string[]
  creators: string[]
}

export function DetailCast({ cast, directors, creators }: Props) {
  if (cast.length === 0 && directors.length === 0 && creators.length === 0) return null

  const crew = directors.length > 0
    ? { label: 'Direção', names: directors }
    : creators.length > 0
    ? { label: 'Criado por', names: creators }
    : null

  return (
    <View style={styles.section}>
      {crew && (
        <Text style={styles.crewLine}>
          <Text style={styles.crewLabel}>{crew.label}: </Text>
          <Text style={styles.crewNames}>{crew.names.join(', ')}</Text>
        </Text>
      )}

      {cast.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Elenco</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castRow}>
            {cast.map((member) => (
              <View key={member.id} style={styles.castCard}>
                {member.profile_path ? (
                  <Image
                    source={{ uri: `${PROFILE_BASE}${member.profile_path}` }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarPlaceholderText}>?</Text>
                  </View>
                )}
                <Text style={styles.actorName} numberOfLines={2}>{member.name}</Text>
                <Text style={styles.character} numberOfLines={2}>{member.character}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  crewLine: {
    ...typography.body,
  },
  crewLabel: {
    color: colors.textSecondary,
  },
  crewNames: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  castRow: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  castCard: {
    width: 80,
    gap: spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 24,
    color: colors.textAuxiliary,
  },
  actorName: {
    ...typography.auxiliary,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  character: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
})
