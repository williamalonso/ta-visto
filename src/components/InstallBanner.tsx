import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, radius, spacing, typography, shadows } from '@/theme'

const DISMISSED_KEY = '@tavisto:pwa_banner_dismissed_at'
const DISMISS_TTL = 30 * 24 * 60 * 60 * 1000 // 30 dias

function getEnv() {
  if (typeof window === 'undefined') return { ios: false, android: false, standalone: true }
  const ua = navigator.userAgent
  const ios = /iPad|iPhone|iPod/.test(ua)
  const android = /Android/.test(ua)
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  return { ios, android, standalone }
}

export function InstallBanner() {
  const [visible, setVisible] = useState(false)
  const [env, setEnv] = useState({ ios: false, android: false, standalone: true })

  useEffect(() => {
    if (Platform.OS !== 'web') return
    const detected = getEnv()
    if (detected.standalone) return

    AsyncStorage.getItem(DISMISSED_KEY).then((val) => {
      if (val) {
        const dismissedAt = Number(val)
        if (Date.now() - dismissedAt < DISMISS_TTL) return
      }
      setEnv(detected)
      setVisible(true)
    })
  }, [])

  const dismiss = async () => {
    await AsyncStorage.setItem(DISMISSED_KEY, String(Date.now()))
    setVisible(false)
  }

  const handleInstall = async () => {
    const prompt = (window as any).__pwaInstallPrompt
    if (prompt) {
      prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        ;(window as any).__pwaInstallPrompt = null
      }
    }
    dismiss()
  }

  if (!visible || Platform.OS !== 'web') return null

  return (
    <View style={styles.banner}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Instale o Tá Visto</Text>
        {env.ios ? (
          <Text style={styles.desc}>
            Toque em{' '}
            <Text style={styles.highlight}>Compartilhar</Text>
            {' → '}
            <Text style={styles.highlight}>Adicionar à tela de início</Text>
          </Text>
        ) : (
          <Text style={styles.desc}>Adicione à tela inicial para abrir como app</Text>
        )}
      </View>

      <View style={styles.actions}>
        {env.android && (
          <Pressable
            style={({ pressed }) => [styles.installBtn, pressed && { opacity: 0.8 }]}
            onPress={handleInstall}
          >
            <Text style={styles.installBtnText}>Instalar</Text>
          </Pressable>
        )}
        <Pressable onPress={dismiss} hitSlop={8}>
          <Text style={styles.dismiss}>✕</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    gap: spacing.md,
    ...shadows.md,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  desc: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  highlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  installBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  installBtnText: {
    ...typography.auxiliary,
    fontWeight: '700',
    color: colors.black,
  },
  dismiss: {
    fontSize: 14,
    color: colors.textAuxiliary,
  },
})
