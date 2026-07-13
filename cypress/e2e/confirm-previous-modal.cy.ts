/**
 * Cenário: ao clicar num episódio que tem episódios anteriores não assistidos,
 * um modal "Marcar anteriores?" deve aparecer com três opções:
 *  - Cancelar → não marca nada
 *  - Só este  → marca só o episódio clicado
 *  - Todos + este → marca todos os anteriores + o clicado
 *
 * Também cobre o mesmo modal ao marcar a season checkbox de uma temporada
 * quando há episódios de temporadas anteriores não assistidos.
 *
 * Dados: fixture series-with-specials.json (T1: 3 eps, T2: 2 eps, Especiais: 2 eps)
 * Série semeada com watchedEpisodes vazio (nenhum ep assistido).
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import fixture from '../fixtures/series-with-specials.json'

const SERIES_KEY = '@cinelist:series'
const TMDB_TV_DETAIL = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}*`
const TMDB_SEASON1 = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/1*`
const TMDB_SEASON2 = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/2*`

const season1Episodes = {
  season_number: 1,
  episodes: [
    { id: 101, episode_number: 1, name: 'Episódio 1', overview: '', still_path: null },
    { id: 102, episode_number: 2, name: 'Episódio 2', overview: '', still_path: null },
    { id: 103, episode_number: 3, name: 'Episódio 3', overview: '', still_path: null },
  ],
}

const season2Episodes = {
  season_number: 2,
  episodes: [
    { id: 201, episode_number: 1, name: 'Episódio 1', overview: '', still_path: null },
    { id: 202, episode_number: 2, name: 'Episódio 2', overview: '', still_path: null },
  ],
}

describe('Modal "Marcar anteriores?"', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)

    cy.intercept('GET', TMDB_TV_DETAIL, { body: fixture.tmdbDetail }).as('tvDetail')
    cy.intercept('GET', TMDB_SEASON1, { body: season1Episodes }).as('season1')
    cy.intercept('GET', TMDB_SEASON2, { body: season2Episodes }).as('season2')

    cy.window().then((win) => {
      const item = { ...fixture.localItem, watchedEpisodes: [] }
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([item]))
    })

    cy.visit(`/detail/${fixture.localItem.id}?mediaType=tv`)
    cy.wait('@tvDetail')
    cy.contains(fixture.localItem.title, { timeout: 10000 }).should('be.visible')
  })

  it('abre o modal ao clicar episódio com anteriores não assistidos', () => {
    // Expande T2 (tem T1 não assistida antes)
    cy.contains('Temporada 2').click()
    cy.wait('@season2')

    cy.contains('Episódio 1').first().click()

    cy.contains('Marcar anteriores?').should('be.visible')
    cy.contains('Há').should('be.visible')
  })

  it('Cancelar fecha o modal sem marcar nenhum episódio', () => {
    cy.contains('Temporada 2').click()
    cy.wait('@season2')
    cy.contains('Episódio 1').first().click()
    cy.contains('Marcar anteriores?').should('be.visible')

    cy.contains('Cancelar').click()

    cy.contains('Marcar anteriores?').should('not.exist')
    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.have.length(0)
    })
  })

  it('"Só este" marca apenas o episódio clicado', () => {
    cy.contains('Temporada 2').click()
    cy.wait('@season2')
    cy.contains('Episódio 1').first().click()
    cy.contains('Marcar anteriores?').should('be.visible')

    cy.contains('Só este').click()

    cy.contains('Marcar anteriores?').should('not.exist')
    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.deep.equal(['2-1'])
    })
  })

  it('"Todos + este" marca os anteriores da T1 e o episódio clicado da T2', () => {
    cy.contains('Temporada 2').click()
    cy.wait('@season2')
    cy.contains('Episódio 1').first().click()
    cy.contains('Marcar anteriores?').should('be.visible')

    cy.contains('Todos + este').click()

    cy.contains('Marcar anteriores?').should('not.exist')
    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.include.members(['1-1', '1-2', '1-3', '2-1'])
      expect(saved.watchedEpisodes).to.have.length(4)
    })
  })

  it('season checkbox abre modal quando temporada anterior tem eps não assistidos', () => {
    // Clica no checkbox de T2 sem nenhum ep de T1 assistido
    cy.get('[data-testid="season-checkbox-2"]').click()
    cy.wait('@season2')

    cy.contains('Marcar anteriores?').should('be.visible')
  })

  it('season checkbox "Todos + este" marca T1 inteira + T2 inteira', () => {
    cy.get('[data-testid="season-checkbox-2"]').click()
    cy.wait('@season2')
    cy.contains('Todos + este').click()

    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.include.members(['1-1', '1-2', '1-3', '2-1', '2-2'])
      expect(saved.watchedEpisodes).to.have.length(5)
    })
  })

  it('não abre modal ao clicar episódio da T1 sem anteriores', () => {
    cy.contains('Temporada 1').click()
    cy.wait('@season1')

    cy.contains('Episódio 1').first().click()

    cy.contains('Marcar anteriores?').should('not.exist')
    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.deep.equal(['1-1'])
    })
  })
})
