export const colors = {
  primary: '#F59E0B',
  primaryLight: '#FEF3C7',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textAuxiliary: '#94A3B8',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  success: '#22C55E',
  completed: '#6366F1',
  watching: '#22C55E',
  planned: '#F59E0B',
  paused: '#F97316',
  error: '#EF4444',
  white: '#FFFFFF',
} as const

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  sectionTitle: { fontSize: 18, fontWeight: '600' as const },
  cardTitle: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  auxiliary: { fontSize: 12, fontWeight: '400' as const },
  statNumber: { fontSize: 36, fontWeight: '700' as const },
} as const

import { Platform } from 'react-native'

export const shadows = {
  sm: Platform.select({
    web: { boxShadow: '0px 2px 4px rgba(15, 23, 42, 0.04)' },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
  })!,
  md: Platform.select({
    web: { boxShadow: '0px 3px 6px rgba(15, 23, 42, 0.06)' },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
    },
  })!,
}
