import { StyleSheet } from 'react-native'
import { colors, spacing, typography } from '@/theme'

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  emptyPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textAuxiliary,
  },
  resultsContainer: {
    flex: 1,
  },
})
