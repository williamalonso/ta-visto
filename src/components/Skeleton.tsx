import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, DimensionValue } from 'react-native'
import { colors, radius } from '@/theme'

interface SkeletonProps {
  width: DimensionValue
  height: number
  borderRadius?: number
}

export function Skeleton({ width, height, borderRadius = radius.sm }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    )
    anim.start()
    return () => anim.stop()
  }, [opacity])

  return <Animated.View style={[styles.base, { width, height, borderRadius, opacity }]} />
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.border,
  },
})
