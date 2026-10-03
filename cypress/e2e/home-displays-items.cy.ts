/**
 * Cenário: ao abrir o app na aba Home com itens salvos, os títulos devem aparecer nas seções
 * corretas conforme o status:
 *  - "Filmes Assistidos Recentemente" e "Séries Assistidas Recentemente" → status completed
 *  - "Continue Assistindo" → status watching
 *
 * Dados: semeados via localStorage antes do carregamento (home-mock-items.json).
 * Sem chamadas ao TMDB — Home lê apenas do AsyncStorage.
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import mockItems from '../fixtures/home-mock-items.json'

const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'
const ONBOARDING_KEY = '@cinelist:onboarding_done'

describe('Home — exibe filmes e séries salvos', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.window().then((win) => {
      win.localStorage.setItem(MOVIES_KEY, JSON.stringify(mockItems.movies))
      win.localStorage.setItem(SERIES_KEY, JSON.stringify(mockItems.series))
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    })
    cy.visit('/')
  })

  it('exibe o filme finalizado na seção Filmes Assistidos Recentemente', () => {
    cy.contains('Filmes Assistidos Recentemente', { timeout: 10000 }).should('be.visible')
    cy.contains(mockItems.movies[0].title).should('be.visible')
  })

  it('não exibe filme com status watching na seção Filmes Assistidos Recentemente', () => {
    cy.contains('Filmes Assistidos Recentemente', { timeout: 10000 }).should('be.visible')
    cy.contains(mockItems.movies[1].title).should('not.exist')
  })

  it('exibe a série finalizada na seção Séries Assistidas Recentemente', () => {
    cy.contains('Séries Assistidas Recentemente', { timeout: 10000 }).should('exist')
    cy.contains(mockItems.series[0].title).should('exist')
  })

  it('exibe filmes e séries com status watching na seção Continue Assistindo', () => {
    cy.contains('Continue Assistindo', { timeout: 10000 }).should('exist')
    cy.contains(mockItems.movies[1].title).should('exist')
    cy.contains(mockItems.series[1].title).should('exist')
  })
})
