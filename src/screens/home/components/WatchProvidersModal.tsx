import { useEffect, useState } from 'react'
import { View, Text, Modal, Pressable, ScrollView, Image, ActivityIndicator, StyleSheet, Linking } from 'react-native'
import { getWatchProviders, TmdbWatchProvider, TmdbWatchProviderResult } from '@/lib/tmdb'
import { MediaItem } from '@/types'
import { colors, radius, spacing, typography } from '@/theme'

const LOGO_BASE = 'https://image.tmdb.org/t/p/w92'

// Web URLs — iOS/Android redirecionam pro app via Universal Links quando instalado
const PROVIDER_URLS: Record<number, string> = {
  8:    'https://www.netflix.com',
  9:    'https://www.primevideo.com',
  119:  'https://www.primevideo.com',
  337:  'https://www.disneyplus.com',
  118:  'https://play.max.com',
  384:  'https://play.max.com',
  425:  'https://play.max.com',
  1825: 'https://play.max.com',
  1899: 'https://play.max.com',
  531:  'https://www.paramountplus.com',
  307:  'https://globoplay.globo.com',
  619:  'https://tv.apple.com',
  350:  'https://tv.apple.com',
  283:  'https://www.crunchyroll.com',
  167:  'https://mubi.com',
  39:   'https://now.com',
  238:  'https://www.canalplus.com',
  553:  'https://www.oldflix.com.br',
  531:  'https://www.paramountplus.com',
  2:    'https://tv.apple.com',
  3:    'https://play.google.com/store/movies',
  68:   'https://www.microsoft.com/en-us/store/movies-and-tv',
  192:  'https://www.youtube.com',
  10:   'https://www.amazon.com.br/gp/video/storefront',
}

function openProvider(providerId: number, tmdbLink: string) {
  const url = PROVIDER_URLS[providerId] ?? tmdbLink
  Linking.openURL(url)
}

interface Props {
  visible: boolean
  item: MediaItem | null
  onClose: () => void
}

function ProviderRow({ label, providers, link }: { label: string; providers: TmdbWatchProvider[]; link: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {providers.map((p) => (
          <Pressable
            key={p.provider_id}
            style={({ pressed }) => [styles.providerBtn, pressed && { opacity: 0.7 }]}
            onPress={() => openProvider(p.provider_id, link)}
          >
            <Image
              source={{ uri: `${LOGO_BASE}${p.logo_path}` }}
              style={styles.logo}
              resizeMode="cover"
            />
            <Text style={styles.providerName} numberOfLines={2}>{p.provider_name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

export function WatchProvidersModal({ visible, item, onClose }: Props) {
  const [data, setData] = useState<TmdbWatchProviderResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible || !item) return
    setLoading(true)
    setData(null)
    getWatchProviders(item.tmdbId, item.mediaType === 'movie' ? 'movie' : 'tv')
      .then(setData)
      .finally(() => setLoading(false))
  }, [visible, item?.tmdbId])

  const hasProviders = data && (data.flatrate?.length || data.rent?.length || data.buy?.length)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title} numberOfLines={1}>{item?.title}</Text>
          <Text style={styles.subtitle}>Onde assistir no Brasil</Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : !hasProviders ? (
            <Text style={styles.empty}>Nenhum serviço de streaming disponível no Brasil.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {data.flatrate?.length ? (
                <ProviderRow label="Streaming" providers={data.flatrate} link={data.link} />
              ) : null}
              {data.rent?.length ? (
                <ProviderRow label="Aluguel" providers={data.rent} link={data.link} />
              ) : null}
              {data.buy?.length ? (
                <ProviderRow label="Compra" providers={data.buy} link={data.link} />
              ) : null}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  loader: {
    marginTop: spacing.xl,
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  providerBtn: {
    alignItems: 'center',
    width: 72,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
  },
  providerName: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
})
