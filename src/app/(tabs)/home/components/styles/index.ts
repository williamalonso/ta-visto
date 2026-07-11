import { StyleSheet } from 'react-native'
import { colors, spacing, typography, radius, shadows } from '@/theme'

export const recentCardStyles = StyleSheet.create({
  card: {
    width: 72,
    marginRight: spacing.md,
  },
  poster: {
    width: 72,
    height: 108,
    borderRadius: radius.md,
  },
  posterPlaceholder: {
    width: 72,
    height: 108,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 24,
  },
  title: {
    ...typography.auxiliary,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  year: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
  },
})

export const continueWatchingCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  poster: {
    width: 48,
    height: 72,
    borderRadius: radius.sm,
  },
  posterPlaceholder: {
    width: 48,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  type: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
