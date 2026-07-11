import { StyleSheet } from 'react-native'
import { colors, spacing, typography } from '@/theme'

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textAuxiliary,
    letterSpacing: 1,
  },
  section: {
    gap: spacing.md,
  },
  infoText: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
    textAlign: 'center',
    lineHeight: 18,
  },
})
