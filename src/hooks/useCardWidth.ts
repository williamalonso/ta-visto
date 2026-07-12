import { useWindowDimensions } from 'react-native'
import { spacing } from '@/theme'

const NUM_COLUMNS = 3

export function useCardWidth(): number {
  const { width: rawWidth } = useWindowDimensions()
  const width = Math.min(rawWidth, 480)
  return (width - spacing.xl * 2 - spacing.md * (NUM_COLUMNS - 1)) / NUM_COLUMNS
}
