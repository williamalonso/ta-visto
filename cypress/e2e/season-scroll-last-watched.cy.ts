/**
 * Cenário: ao expandir uma temporada longa, a lista interna de episódios desliza
 * até o último episódio assistido.
 *  - Com episódios assistidos → lista rola e o último assistido fica visível
 *  - Sem episódios assistidos → lista fica no topo
 *
 * Dados: TMDB mockado via cy.intercept (temporada com 30 episódios).
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import fixture from '../fixtures/series-with-specials.json'

const SERIES_KEY = '@cinelist:series'
const ONBOARDING_KEY = '@cinelist:onboarding_done'
const EPISODE_COUNT = 30
const LIST = '[data-testid="episode-list-1"]'

const tvDetail = {
  ...fixture.tmdbDetail,
  status: 'Returning Series',
  seasons: [{ id: 9101, name: 'Temporada 1', season_number: 1, episode_count: EPISODE_COUNT, air_date: '2020-03-01' }],
}

const season1Episodes = {
  season_number: 1,
  episodes: Array.from({ length: EPISODE_COUNT }, (_, i) => ({
    id: 1000 + i,
    episode_number: i + 1,
    name: `Episódio ${i + 1}`,
    overview: '',
    air_date: null,
    vote_average: 0,
    still_path: null,
  })),
}

function visitWithWatched(watchedEpisodes: string[]) {
  cy.visit(`/detail/${fixture.localItem.id}?mediaType=tv`, {
    onBeforeLoad(win) {
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([{ ...fixture.localItem, watchedEpisodes }]))
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    },
  })
  cy.wait('@tvDetail')
  cy.contains('Temporada 1').click()
  cy.wait('@season1')
  cy.get(LIST).should('be.visible')
}

describe('Scroll até o último episódio assistido', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.intercept('GET', `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}*`, { body: tvDetail }).as('tvDetail')
    cy.intercept('GET', `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/1*`, { body: season1Episodes }).as('season1')
  })

  it('com episódios assistidos, rola até o último assistido', () => {
    const watched = Array.from({ length: 20 }, (_, i) => `1-${i + 1}`)
    visitWithWatched(watched)

    // Rolagem animada: espera até sair do topo
    cy.get(LIST).should(($list) => {
      expect($list[0].scrollTop).to.be.greaterThan(0)
    })

    // O episódio 20 precisa estar dentro da área visível da lista
    cy.get(LIST).then(($list) => {
      cy.get('[data-testid="episode-name-20"]').should(($row) => {
        const list = $list[0].getBoundingClientRect()
        const row = $row[0].getBoundingClientRect()
        expect(row.top).to.be.at.least(list.top - 1)
        expect(row.bottom).to.be.at.most(list.bottom + 1)
      })
    })
  })

  it('sem episódios assistidos, a lista fica no topo', () => {
    visitWithWatched([])

    cy.get('[data-testid="episode-name-1"]').should('be.visible')
    cy.wait(800) // tempo de sobra para uma eventual rolagem animada
    cy.get(LIST).should(($list) => {
      expect($list[0].scrollTop).to.eq(0)
    })
  })
})
