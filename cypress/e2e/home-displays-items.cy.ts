/**
 * Cenário: ao abrir o app na aba Home com itens salvos, os títulos devem aparecer nas seções
 * "Filmes Recentes" e "Séries Recentes".
 *
 * Dados: semeados via localStorage antes do carregamento (home-mock-items.json).
 * Sem chamadas ao TMDB — Home lê apenas do AsyncStorage.
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import mockItems from '../fixtures/home-mock-items.json'

const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'

describe('Home — exibe filmes e séries salvos', () => {
  beforeEach(() => {
    // Roda após o beforeEach global (e2e.ts) que injeta [].
    // Sobrescreve com os dados mockados e visita a home.
    cy.window().then((win) => {
      win.localStorage.setItem(MOVIES_KEY, JSON.stringify(mockItems.movies))
      win.localStorage.setItem(SERIES_KEY, JSON.stringify(mockItems.series))
    })
    cy.visit('/')
  })

  it('exibe o filme mockado na seção Filmes Recentes', () => {
    cy.contains('Filmes Recentes', { timeout: 10000 }).should('be.visible')
    cy.contains(mockItems.movies[0].title).should('be.visible')
  })

  it('exibe a série mockada na seção Séries Recentes', () => {
    cy.contains('Séries Recentes', { timeout: 10000 }).should('exist')
    cy.contains(mockItems.series[0].title).should('exist')
  })
})
