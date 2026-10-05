import { useEffect, useMemo, useState } from 'react'
import { View, StyleSheet, LayoutChangeEvent } from 'react-native'
import Reanimated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { colors } from '@/theme'

const PIECE_COUNT = 80
const DURATION = 3200
const PALETTE = [
  colors.primary,
  colors.success,
  colors.planned,
  colors.upToDate,
  colors.watching,
  colors.error,
]

interface Piece {
  x: number
  delay: number      // fração da animação antes da peça começar a cair (0–0.35)
  speed: number      // multiplicador da distância de queda
  drift: number      // amplitude do balanço horizontal
  wobble: number     // quantas oscilações durante a queda
  spin: number       // rotação total em graus
  width: number
  height: number
  color: string
  round: boolean
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function makePieces(width: number): Piece[] {
  return Array.from({ length: PIECE_COUNT }, () => {
    const size = randomBetween(6, 11)
    const round = Math.random() < 0.25
    return {
      x: randomBetween(0, width),
      delay: randomBetween(0, 0.35),
      speed: randomBetween(0.85, 1.15),
      drift: randomBetween(10, 35),
      wobble: randomBetween(1, 3),
      spin: randomBetween(360, 1080) * (Math.random() < 0.5 ? -1 : 1),
      width: size,
      height: round ? size : size * randomBetween(0.4, 0.6),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      round,
    }
  })
}

function ConfettiPiece({ piece, progress, height }: { piece: Piece; progress: SharedValue<number>; height: number }) {
  const style = useAnimatedStyle(() => {
    const t = Math.min(1, Math.max(0, (progress.value - piece.delay) / (1 - piece.delay)))
    // Queda acelerando levemente, como gravidade com resistência do ar
    const y = -20 + (height + 40) * piece.speed * Math.pow(t, 1.15)
    const x = piece.x + Math.sin(t * Math.PI * 2 * piece.wobble) * piece.drift
    const opacity = t === 0 ? 0 : t > 0.85 ? (1 - t) / 0.15 : 1
    return {
      opacity,
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${piece.spin * t}deg` },
        { scaleX: Math.cos(t * Math.PI * 4 * piece.wobble) },
      ],
    }
  })

  return (
    <Reanimated.View
      testID="confetti-piece"
      style={[
        styles.piece,
        {
          width: piece.width,
          height: piece.height,
          backgroundColor: piece.color,
          borderRadius: piece.round ? piece.width / 2 : 1,
        },
        style,
      ]}
    />
  )
}

interface ConfettiProps {
  /** Incrementar este valor dispara uma nova chuva de confete. 0 = nada. */
  trigger: number
}

export function Confetti({ trigger }: ConfettiProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)
  const [active, setActive] = useState(false)
  const progress = useSharedValue(0)

  const pieces = useMemo(
    () => (size && trigger > 0 ? makePieces(size.width) : []),
    [size?.width, trigger]
  )

  useEffect(() => {
    if (trigger === 0) return
    setActive(true)
    progress.value = 0
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.linear })
    const timeout = setTimeout(() => setActive(false), DURATION)
    return () => clearTimeout(timeout)
  }, [trigger])

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize({ width, height })
  }

  return (
    <View testID="confetti" style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={handleLayout}>
      {active && size &&
        pieces.map((piece, i) => (
          <ConfettiPiece key={`${trigger}-${i}`} piece={piece} progress={progress} height={size.height} />
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
})
