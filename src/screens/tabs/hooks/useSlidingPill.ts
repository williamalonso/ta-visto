import { useRef, useEffect } from 'react'
import { Animated, Platform } from 'react-native'
import { PILL_W, TAB_COUNT } from '../constants'

export function useSlidingPill(activeIndex: number) {
  const pillX = useRef(new Animated.Value(0)).current
  const tabW = useRef(0)
  const ready = useRef(false)

  const movePill = (index: number, animate: boolean) => {
    const x = index * tabW.current + (tabW.current - PILL_W) / 2
    if (animate) {
      Animated.spring(pillX, {
        toValue: x,
        useNativeDriver: Platform.OS !== 'web',
        stiffness: 280,
        damping: 28,
        mass: 0.8,
      }).start()
    } else {
      pillX.setValue(x)
    }
  }

  const onLayout = (totalWidth: number) => {
    tabW.current = totalWidth / TAB_COUNT
    movePill(activeIndex, false)
    ready.current = true
  }

  useEffect(() => {
    if (ready.current) movePill(activeIndex, true)
  }, [activeIndex])

  return { pillX, onLayout }
}
