import { ScrollViewStyleReset } from 'expo-router/html'
import { type PropsWithChildren } from 'react'

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
        <meta property="og:image" content="/icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tá Visto" />
        <meta name="twitter:description" content="Sua lista pessoal de filmes e séries" />

        {/* iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tá Visto" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <ScrollViewStyleReset />

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
                // PWA retomado do segundo plano não navega: verifica se há deploy novo
                var lastCheck = Date.now();
                document.addEventListener('visibilitychange', function() {
                  if (document.visibilityState !== 'visible' || Date.now() - lastCheck < 60000) return;
                  lastCheck = Date.now();
                  navigator.serviceWorker.getRegistration().then(function(reg) { if (reg) reg.update(); });
                  var current = document.querySelector('script[src*="/_expo/static/js/"]');
                  if (!current) return;
                  fetch('/', { cache: 'no-store' }).then(function(r) { return r.text(); }).then(function(html) {
                    if (html.indexOf(current.getAttribute('src')) === -1) location.reload();
                  }).catch(function() {});
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
