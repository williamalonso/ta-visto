<div align="center">
  <h1>Tá Visto</h1>
  <p>App mobile pessoal para rastrear filmes e séries assistidos</p>
</div>

<div align="center">
  <img src="/src/assets/images/home.png" alt"Home page" title="Home page" width="300" />
</div>

## 🤔 Sobre

Clone do TV Time — busca títulos via TMDB, organiza em listas por status (assistindo, pretendo assistir, finalizado etc.) e persiste tudo localmente no dispositivo. Suporta exportação e importação de backup em JSON.

## ✨ Funcionalidades

- **Dashboard** — contadores gerais e últimos títulos adicionados
- **Busca** — busca filmes ou séries na API TMDB com debounce, com seção de trending da semana
- **Filmes** — lista pessoal separada por status com opções de editar e remover
- **Séries** — mesma estrutura, com status extra "Em dia" para séries em andamento e rastreamento de episódios por temporada
- **Configurações** — exportar e importar backup JSON dos seus dados

## 🙅 Stack

- **React Native** + **Expo** ~56
- **TypeScript** 6, strict mode
- **Expo Router** v56.2 — navegação file-based
- **AsyncStorage** — persistência local (sem Redux/Zustand)
- **TMDB API** v3 — dados de filmes e séries
- `expo-file-system` + `expo-sharing` + `expo-document-picker` — backup
- **Cypress** — testes E2E (versão web)

## ⚙️ Pré-requisitos

- Node.js
- Conta no [TMDB](https://www.themoviedb.org/settings/api) para gerar uma API Key

## 🔧 Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/ta-visto.git
cd ta-visto
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` na raiz com sua chave do TMDB:

```
EXPO_PUBLIC_TMDB_API_KEY=sua_chave_aqui
```

## 🚀 Rodando o App

```bash
# Inicia o servidor de desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web (necessário para rodar os testes Cypress)
npm run web
```

## 🧪 Testes

Os testes E2E usam **Cypress** e rodam contra a versão web do app (`npm run web`).

Os dados do usuário não são afetados — o teste salva e restaura o localStorage automaticamente, e as chamadas à API TMDB são interceptadas com fixtures mockadas.

**1. Sobe o app web em um terminal:**

```bash
npm run web
```

**2. Em outro terminal, abre o Cypress:**

```bash
# Modo interativo (recomendado para desenvolvimento)
npm run cy:open

# Modo headless (CI)
npm run cy:run
```

No painel do Cypress: **E2E Testing** → escolhe o browser → clica no arquivo de teste.

## 💾 Backup

Na aba **Configurações**, é possível exportar todos os dados como um arquivo `.json` e importá-los em outro dispositivo. A importação sobrescreve os dados existentes — um alerta de confirmação é exibido antes.
