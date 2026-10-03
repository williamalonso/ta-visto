/**
 * Cenário: clicar no ícone ⓘ de um episódio abre um modal com os detalhes do episódio
 * (sinopse, data, duração, nota). O tap normal no episódio ainda marca/desmarca sem abrir modal.
 *
 * Dados: TMDB mockado via cy.intercept.
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import fixture from '../fixtures/series-with-specials.json'

const SERIES_KEY = '@cinelist:series'
const ONBOARDING_KEY = '@cinelist:onboarding_done'
const TMDB_TV_DETAIL = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}*`
const TMDB_SEASON1 = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/1*`
const TMDB_EP_DETAIL = `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/1/episode/1*`

const season1Episodes = {
  season_number: 1,
  episodes: [
    { id: 101, episode_number: 1, name: 'Episódio Piloto', overview: '', air_date: null, vote_average: 0, still_path: null },
    { id: 102, episode_number: 2, name: 'Episódio 2', overview: '', air_date: null, vote_average: 0, still_path: null },
    { id: 103, episode_number: 3, name: 'Episódio 3', overview: '', air_date: null, vote_average: 0, still_path: null },
  ],
}

const episodeDetail = {
  id: 101,
  name: 'Episódio Piloto',
  episode_number: 1,
  season_number: 1,
  overview: 'A história começa aqui. Uma sinopse de teste para o Cypress.',
  air_date: '2024-03-10',
  vote_average: 8.5,
  runtime: 52,
  still_path: null,
  guest_stars: [{ id: 99, name: 'Ator Convidado', character: 'Personagem X', profile_path: null, order: 0 }],
  crew: [{ id: 50, name: 'Diretora Silva', job: 'Director', department: 'Directing', profile_path: null }],
}

describe('Modal de detalhes do episódio', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)

    cy.intercept('GET', TMDB_TV_DETAIL, { body: fixture.tmdbDetail }).as('tvDetail')
    cy.intercept('GET', TMDB_SEASON1, { body: season1Episodes }).as('season1')
    cy.intercept('GET', TMDB_EP_DETAIL, { body: episodeDetail }).as('epDetail')

    cy.window().then((win) => {
      const item = { ...fixture.localItem, watchedEpisodes: [] }
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([item]))
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    })

    cy.visit(`/detail/${fixture.localItem.id}?mediaType=tv`)
    cy.wait('@tvDetail')
    cy.contains(fixture.localItem.title, { timeout: 10000 }).should('be.visible')

    cy.contains('Temporada 1').click()
    cy.wait('@season1')
    cy.contains('Episódio Piloto').should('be.visible')
  })

  it('abre o modal ao clicar no ícone ⓘ do episódio', () => {
    cy.get('[data-testid="episode-info-1"]').click()
    cy.wait('@epDetail')

    cy.contains('T1 · E1').should('be.visible')
    cy.contains('Episódio Piloto').should('be.visible')
    cy.contains('A história começa aqui').should('be.visible')
    cy.contains('52 min').should('be.visible')
    cy.contains('★ 8.5').should('be.visible')
    cy.contains('Diretora Silva').should('be.visible')
  })

  it('fecha o modal ao clicar fora', () => {
    cy.get('[data-testid="episode-info-1"]').click()
    cy.wait('@epDetail')
    cy.contains('A história começa aqui').should('be.visible')

    cy.get('body').click(10, 10)

    cy.contains('A história começa aqui').should('not.exist')
  })

  it('tap normal no episódio marca/desmarca sem abrir modal', () => {
    cy.contains('Episódio Piloto').click()

    cy.contains('A história começa aqui').should('not.exist')

    cy.window().then((win) => {
      const series = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')
      const saved = series.find((s: any) => s.id === fixture.localItem.id)
      expect(saved.watchedEpisodes).to.include('1-1')
    })
  })
})
