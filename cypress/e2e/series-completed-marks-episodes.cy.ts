/**
 * Cenário: ao mudar o status de uma série para "Finalizado", todos os episódios
 * de temporadas normais (season_number > 0) devem ser marcados com ✓,
 * e os episódios especiais (season_number === 0) NÃO devem ser marcados.
 *
 * Cobre dois fluxos:
 *  1. Série já salva → detalhe → Alterar → Finalizado
 *  2. Busca → "+" → Finalizado (série ainda não salva)
 *
 * Dados: TMDB mockado via cy.intercept.
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import fixture from '../fixtures/series-with-specials.json'

const SERIES_KEY = '@cinelist:series'
const TMDB_TV_DETAIL = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}*`
const TMDB_SEARCH = `https://api.themoviedb.org/3/search/tv*`

describe('Finalizado marca só temporadas normais', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.intercept('GET', TMDB_TV_DETAIL, { body: fixture.tmdbDetail }).as('tvDetail')
  })

  it('fluxo detalhe: Alterar → Finalizado marca temporadas normais e mantém especiais desmarcados', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([fixture.localItem]))
    })

    cy.visit(`/detail/${fixture.localItem.id}?mediaType=tv`)
    cy.wait('@tvDetail')
    cy.contains(fixture.localItem.title, { timeout: 10000 }).should('be.visible')

    cy.contains('Alterar').click()
    cy.contains('Finalizado').click()

    cy.get('[data-testid="season-checkbox-1"]').should('contain', '✓')
    cy.get('[data-testid="season-checkbox-2"]').should('contain', '✓')
    cy.get('[data-testid="season-checkbox-0"]').should('contain', '○')
    cy.contains('Finalizado').should('be.visible')
  })

  it('fluxo busca: "+" → Finalizado marca temporadas normais no detalhe', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([]))
    })

    cy.intercept('GET', TMDB_SEARCH, {
      body: {
        results: [{
          id: fixture.localItem.tmdbId,
          name: fixture.localItem.title,
          poster_path: null,
          overview: fixture.localItem.overview,
          first_air_date: fixture.localItem.releaseDate,
          vote_average: fixture.localItem.voteAverage,
          media_type: 'tv',
        }],
        total_results: 1,
      },
    }).as('search')

    cy.visit('/search')
    cy.get('input[placeholder*="Buscar"]').type(fixture.localItem.title)
    cy.wait('@search')

    cy.contains(fixture.localItem.title).should('be.visible')
    cy.get('[data-testid^="add-btn-"]').first().click()
    cy.contains('Finalizado').click()
    cy.wait('@tvDetail')

    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.tmdbId === fixture.localItem.tmdbId)
      expect(saved).to.exist
      expect(saved.status).to.equal('completed')
      // temporadas normais (1 e 2): 3 + 2 = 5 episódios
      expect(saved.watchedEpisodes).to.have.length(5)
      expect(saved.watchedEpisodes).to.include('1-1')
      expect(saved.watchedEpisodes).to.not.include('0-1')
    })
  })
})
