import { ScrollViewStyleReset } from 'expo-router/html'
import { type PropsWithChildren } from 'react'
import { colors } from '@/theme'

// WhatsApp/Facebook exigem URLs absolutas em og:image e og:url
const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')
const OG_IMAGE = `${SITE_URL}/icon.png`

// Barra de rolagem fina e no tema para as listas de episódios (web)
const EPISODE_SCROLL = '[data-testid^="episode-list-"]'
// Chrome/Safari ignoram ::-webkit-scrollbar quando scrollbar-color existe,
// então as propriedades padrão ficam só para quem não suporta o pseudo-elemento (Firefox)
const scrollbarCss = `
  @supports not selector(::-webkit-scrollbar) {
    ${EPISODE_SCROLL} {
      scrollbar-width: thin;
      scrollbar-color: ${colors.border} transparent;
    }
    ${EPISODE_SCROLL}:hover {
      scrollbar-color: ${colors.primary} transparent;
    }
  }
  ${EPISODE_SCROLL}::-webkit-scrollbar {
    width: 6px;
  }
  ${EPISODE_SCROLL}::-webkit-scrollbar-track {
    background: transparent;
  }
  ${EPISODE_SCROLL}::-webkit-scrollbar-thumb {
    background-color: ${colors.border};
    border-radius: 999px;
  }
  ${EPISODE_SCROLL}:hover::-webkit-scrollbar-thumb {
    background-color: ${colors.primary};
  }
  ${EPISODE_SCROLL}::-webkit-scrollbar-button {
    display: none;
  }
`

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* PWA */}
        <meta name="theme-color" content="#0F1117" />
        <meta name="application-name" content="Tá Visto" />
        <meta name="description" content="Sua lista pessoal de filmes e séries" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tá Visto" />
        <meta property="og:description" content="Sua lista pessoal de filmes e séries" />
        <meta property="og:site_name" content="Tá Visto" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:secure_url" content={OG_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1254" />
        <meta property="og:image:height" content="1254" />
        <meta property="og:image:alt" content="Ícone do Tá Visto" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Tá Visto" />
        <meta name="twitter:description" content="Sua lista pessoal de filmes e séries" />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tá Visto" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: scrollbarCss }} />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__pwaInstallPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__pwaInstallPrompt = e;
              });
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
