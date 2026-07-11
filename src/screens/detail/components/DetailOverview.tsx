import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, typography } from '@/theme'

type Props = {
  overview: string
}

export function DetailOverview({ overview }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sinopse</Text>
      <Text style={styles.overview}>{overview}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  overview: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
})
