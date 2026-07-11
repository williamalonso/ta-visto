import { StyleSheet } from 'react-native'
import { colors, spacing, typography, radius } from '@/theme'

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.auxiliary,
    fontWeight: '700',
    color: colors.white,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionTitleSpaced: {
    marginTop: spacing.xxl,
  },
  statsSkeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statSkeletonItem: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  recentList: {
    paddingRight: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
})
