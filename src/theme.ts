export const colors = {
  // Brand
  primary: '#F59E0B',
  primaryHover: '#D97706',
  primaryLight: '#2A2010',

  // Texto
  textPrimary: '#F1F5F9',
  textSecondary: '#8B92A5',
  textAuxiliary: '#5C6070',

  // Fundos
  background: '#0F1117',
  surface: '#1A1D27',
  surfaceSecondary: '#252836',
  border: '#2D3148',

  // Estados
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',

  // Status
  watching: '#2563EB',
  completed: '#10B981',
  planned: '#F59E0B',
  paused: '#64748B',

  // Base
  white: '#FFFFFF',
  black: '#111827',
  overlay: 'rgba(0,0,0,0.4)',
} as const;

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
