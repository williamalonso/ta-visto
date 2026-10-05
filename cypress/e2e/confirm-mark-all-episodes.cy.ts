/**
 * Cenário: ao clicar no checkbox de uma temporada sem episódios anteriores pendentes,
 * um modal de confirmação "Marcar temporada?" deve aparecer.
 *  - Cancelar → não marca nada
 *  - Confirmar → todos os episódios da temporada são marcados
 *  - Desmarcar (quando já tudo marcado) → modal "Desmarcar temporada?"
 *
 * Dados: fixture series-with-specials.json, apenas T1 usada (sem temporadas anteriores).
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import fixture from '../fixtures/series-with-specials.json'

const SERIES_KEY = '@cinelist:series'
const ONBOARDING_KEY = '@cinelist:onboarding_done'
const TMDB_TV_DETAIL = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}*`
const TMDB_SEASON1 = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/1*`

const season1Episodes = {
  season_number: 1,
  episodes: [
    { id: 101, episode_number: 1, name: 'Episódio 1', overview: '', air_date: null, vote_average: 0, still_path: null },
    { id: 102, episode_number: 2, name: 'Episódio 2', overview: '', air_date: null, vote_average: 0, still_path: null },
    { id: 103, episode_number: 3, name: 'Episódio 3', overview: '', air_date: null, vote_average: 0, still_path: null },
  ],
}

describe('Modal "Marcar temporada?"', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)

    cy.intercept('GET', TMDB_TV_DETAIL, { body: fixture.tmdbDetail }).as('tvDetail')
    cy.intercept('GET', TMDB_SEASON1, { body: season1Episodes }).as('season1')

    cy.window().then((win) => {
      const item = { ...fixture.localItem, watchedEpisodes: [] }
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([item]))
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    })

    cy.visit(`/detail/${fixture.localItem.id}?mediaType=tv`)
    cy.wait('@tvDetail')
    cy.contains('Alterar', { timeout: 10000 }).should('be.visible')
  })

  it('abre o modal ao clicar no checkbox da T1 (sem temporadas anteriores)', () => {
    cy.get('[data-testid="season-checkbox-1"]').click()
    cy.wait('@season1')

    cy.contains('Marcar temporada?').should('be.visible')
    cy.contains('Marcar todos os 3 episódios como assistidos?').should('be.visible')
  })

  it('Cancelar fecha o modal sem marcar nenhum episódio', () => {
    cy.get('[data-testid="season-checkbox-1"]').click()
    cy.wait('@season1')
    cy.contains('Marcar temporada?').should('be.visible')

    cy.contains('Cancelar').click()

    cy.contains('Marcar temporada?').should('not.exist')
    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.have.length(0)
    })
  })

  it('Confirmar marca todos os episódios da temporada', () => {
    cy.get('[data-testid="season-checkbox-1"]').click()
    cy.wait('@season1')
    cy.contains('Marcar temporada?').should('be.visible')

    cy.get('[data-testid="confirm-mark-season-btn"]').click()

    cy.contains('Marcar temporada?').should('not.exist')
    cy.get('[data-testid="season-checkbox-1"]').should('contain', '✓')
    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.include.members(['1-1', '1-2', '1-3'])
      expect(saved.watchedEpisodes).to.have.length(3)
    })
  })

  it('desmarcar temporada já completa pede confirmação', () => {
    // Marca tudo primeiro via localStorage
    cy.window().then((win) => {
      const item = { ...fixture.localItem, watchedEpisodes: ['1-1', '1-2', '1-3'] }
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([item]))
    })
    cy.reload()
    cy.wait('@tvDetail')

    cy.get('[data-testid="season-checkbox-1"]').should('contain', '✓').click()

    cy.contains('Marcar temporada?').should('not.exist')
    cy.contains('Desmarcar temporada?').should('be.visible')

    // Cancelar mantém tudo marcado
    cy.contains('Cancelar').click()
    cy.contains('Desmarcar temporada?').should('not.exist')
    cy.get('[data-testid="season-checkbox-1"]').should('contain', '✓')

    // Confirmar desmarca
    cy.get('[data-testid="season-checkbox-1"]').click()
    cy.get('[data-testid="confirm-mark-season-btn"]').click()
    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.have.length(0)
    })
  })
})
