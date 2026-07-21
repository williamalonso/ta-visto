import { View, Text, Pressable, Platform, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { SymbolView } from 'expo-symbols'
import { colors, radius, spacing, typography, shadows } from '@/theme'

function detectEnv() {
  if (typeof window === 'undefined') return { ios: false, android: false, standalone: false }
  const ua = navigator.userAgent
  return {
    ios: /iPad|iPhone|iPod/.test(ua),
    android: /Android/.test(ua),
    standalone:
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true,
  }
}

export function InstallSection() {
  if (Platform.OS !== 'web') return null

  const [env, setEnv] = useState({ ios: false, android: false, standalone: false })
  const [androidManual, setAndroidManual] = useState(false)

  useEffect(() => {
    setEnv(detectEnv())
  }, [])

  const handleInstall = async () => {
    const prompt = (window as any).__pwaInstallPrompt
    if (prompt) {
      prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        ;(window as any).__pwaInstallPrompt = null
      }
    } else {
      setAndroidManual(true)
    }
  }

  return (
    <>
      <Text style={styles.sectionLabel}>INSTALAR APP</Text>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <SymbolView
            name={{ ios: 'arrow.down.app', android: 'install_mobile', web: 'install_mobile' }}
            size={22}
            tintColor={colors.primary}
          />
        </View>

        <View style={styles.body}>
          {env.standalone ? (
            <>
              <Text style={styles.title}>App instalado ✓</Text>
              <Text style={styles.desc}>Você já está usando o Tá Visto como app.</Text>
            </>
          ) : env.ios ? (
            <>
              <Text style={styles.title}>Instalar no iPhone / iPad</Text>
              <Text style={styles.desc}>
                Toque em <Text style={styles.highlight}>Compartilhar</Text>
                {' → '}
                <Text style={styles.highlight}>Adicionar à tela de início</Text>
              </Text>
            </>
          ) : env.android && androidManual ? (
            <>
              <Text style={styles.title}>Instalar no Android</Text>
              <Text style={styles.desc}>
                Toque no menu <Text style={styles.highlight}>⋮</Text> do Chrome
                {' → '}
                <Text style={styles.highlight}>Adicionar à tela inicial</Text>
              </Text>
            </>
          ) : env.android ? (
            <>
              <Text style={styles.title}>Instalar no Android</Text>
              <Text style={styles.desc}>Abre como app, sem barra do navegador.</Text>
              <Pressable
                style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
                onPress={handleInstall}
              >
                <Text style={styles.btnText}>Instalar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.title}>Instalar como app</Text>
              <Text style={styles.desc}>
                No Chrome Android: menu <Text style={styles.highlight}>⋮</Text>
                {' → '}
                <Text style={styles.highlight}>Adicionar à tela inicial</Text>
                {'\n'}No Safari iOS: <Text style={styles.highlight}>Compartilhar → Adicionar à tela de início</Text>
              </Text>
            </>
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textAuxiliary,
    letterSpacing: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  body: {
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
  btn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  btnText: {
    ...typography.auxiliary,
    fontWeight: '700',
    color: colors.black,
  },
})
