/**
 * Cenário: ao finalizar um filme ou série, uma chuva de confete aparece na tela de detalhe.
 *  - Filme: Alterar → Finalizado dispara o confete
 *  - Filme já finalizado: escolher Finalizado de novo NÃO dispara
 *  - Filme: mudar para outro status (ex.: Pretendo assistir) NÃO dispara
 *  - Série encerrada: marcar o último episódio que faltava → status vira Finalizado e dispara
 *  - O confete some sozinho depois da animação (~3s)
 *
 * Dados: TMDB mockado via cy.intercept.
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import fixture from '../fixtures/series-with-specials.json'

const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'
const ONBOARDING_KEY = '@cinelist:onboarding_done'
const PIECE = '[data-testid="confetti-piece"]'

const movie = {
  id: 'mock-movie-cy-confetti',
  tmdbId: 999101,
  mediaType: 'movie',
  title: 'Filme Teste Confete',
  posterPath: null,
  overview: 'Filme para testar o confete.',
  releaseDate: '2020-01-01',
  voteAverage: 7.5,
  status: 'watching',
  rating: null,
  notes: null,
  watchedEpisodes: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

const movieDetail = {
  id: movie.tmdbId,
  title: movie.title,
  overview: movie.overview,
  poster_path: null,
  backdrop_path: null,
  release_date: movie.releaseDate,
  vote_average: movie.voteAverage,
  runtime: 110,
  genres: [{ id: 1, name: 'Drama' }],
  credits: { cast: [], crew: [] },
  recommendations: { results: [] },
}

const season2Episodes = {
  season_number: 2,
  episodes: [
    { id: 201, episode_number: 1, name: 'T2 Episódio 1', overview: '', air_date: null, vote_average: 0, still_path: null },
    { id: 202, episode_number: 2, name: 'T2 Episódio Final', overview: '', air_date: null, vote_average: 0, still_path: null },
  ],
}

function visitMovie(status: string) {
  cy.visit(`/detail/${movie.id}?mediaType=movie`, {
    onBeforeLoad(win) {
      win.localStorage.setItem(MOVIES_KEY, JSON.stringify([{ ...movie, status }]))
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    },
  })
  cy.wait('@movieDetail')
  cy.contains('Alterar').should('be.visible')
}

function chooseStatus(status: string) {
  cy.contains('Alterar').click()
  cy.contains('Selecionar status').should('be.visible')
  cy.get(`[data-testid="status-option-${status}"]`).click()
}

describe('Confete ao finalizar', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.intercept('GET', `https://api.themoviedb.org/3/movie/${movie.tmdbId}*`, { body: movieDetail }).as('movieDetail')
  })

  it('filme: Alterar → Finalizado dispara o confete, que depois some', () => {
    visitMovie('watching')
    cy.get(PIECE).should('not.exist')

    chooseStatus('completed')

    cy.get(PIECE).should('have.length.greaterThan', 0)
    cy.window().then((win) => {
      const saved = JSON.parse(win.localStorage.getItem(MOVIES_KEY) || '[]')[0]
      expect(saved.status).to.eq('completed')
    })

    // A animação dura ~3,2s; depois disso as peças são removidas
    cy.get(PIECE, { timeout: 6000 }).should('not.exist')
  })

  it('filme já finalizado: escolher Finalizado de novo não dispara', () => {
    visitMovie('completed')
    chooseStatus('completed')
    cy.get(PIECE).should('not.exist')
  })

  it('filme: mudar para outro status não dispara', () => {
    visitMovie('watching')
    chooseStatus('plan_to_watch')
    cy.get(PIECE).should('not.exist')
  })

  it('série encerrada: marcar o último episódio que faltava finaliza e dispara', () => {
    cy.intercept('GET', `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}*`, { body: fixture.tmdbDetail }).as('tvDetail')
    cy.intercept('GET', `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/2*`, { body: season2Episodes }).as('season2')

    // Fixture tem status "Ended": T1 (3 eps) + T2 (2 eps). Falta só o 2-2.
    cy.visit(`/detail/${fixture.localItem.id}?mediaType=tv`, {
      onBeforeLoad(win) {
        const item = { ...fixture.localItem, watchedEpisodes: ['1-1', '1-2', '1-3', '2-1'] }
        win.localStorage.setItem(SERIES_KEY, JSON.stringify([item]))
        win.localStorage.setItem(ONBOARDING_KEY, '1')
      },
    })
    cy.wait('@tvDetail')

    cy.contains('Temporada 2').click()
    cy.wait('@season2')
    cy.get(PIECE).should('not.exist')

    cy.get('[data-testid="episode-check-2"]').click()

    cy.get(PIECE).should('have.length.greaterThan', 0)
    cy.window().then((win) => {
      const saved = JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')[0]
      expect(saved.status).to.eq('completed')
    })
  })
})
