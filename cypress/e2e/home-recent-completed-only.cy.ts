/**
 * Cenário: as seções "Filmes Assistidos Recentemente" e "Séries Assistidas Recentemente"
 * devem exibir apenas itens com status "completed".
 * Itens com outros status (watching, plan_to_watch, on_hold) não devem aparecer nessas seções.
 * Itens com status "watching" devem aparecer em "Continue Assistindo".
 *
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'
const ONBOARDING_KEY = '@cinelist:onboarding_done'

const movies = [
  {
    id: 'test-m-completed',
    tmdbId: 11001,
    mediaType: 'movie',
    title: 'Filme Completo',
    posterPath: null,
    overview: '',
    releaseDate: '2024-01-01',
    voteAverage: 8,
    status: 'completed',
    rating: null,
    notes: null,
    watchedEpisodes: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'test-m-watching',
    tmdbId: 11002,
    mediaType: 'movie',
    title: 'Filme Assistindo',
    posterPath: null,
    overview: '',
    releaseDate: '2024-02-01',
    voteAverage: 7,
    status: 'watching',
    rating: null,
    notes: null,
    watchedEpisodes: [],
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-02T00:00:00.000Z',
  },
  {
    id: 'test-m-planned',
    tmdbId: 11003,
    mediaType: 'movie',
    title: 'Filme Pretendo',
    posterPath: null,
    overview: '',
    releaseDate: '2024-03-01',
    voteAverage: 6,
    status: 'plan_to_watch',
    rating: null,
    notes: null,
    watchedEpisodes: [],
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-02T00:00:00.000Z',
  },
]

const series = [
  {
    id: 'test-s-completed',
    tmdbId: 12001,
    mediaType: 'tv',
    title: 'Série Completa',
    posterPath: null,
    overview: '',
    releaseDate: '2024-01-01',
    voteAverage: 9,
    status: 'completed',
    rating: null,
    notes: null,
    watchedEpisodes: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'test-s-watching',
    tmdbId: 12002,
    mediaType: 'tv',
    title: 'Série Assistindo',
    posterPath: null,
    overview: '',
    releaseDate: '2024-02-01',
    voteAverage: 7,
    status: 'watching',
    rating: null,
    notes: null,
    watchedEpisodes: [],
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-02T00:00:00.000Z',
  },
]

describe('Home — seções de recentes exibem só completed', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.window().then((win) => {
      win.localStorage.setItem(MOVIES_KEY, JSON.stringify(movies))
      win.localStorage.setItem(SERIES_KEY, JSON.stringify(series))
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    })
    cy.visit('/')
  })

  it('Filmes Assistidos Recentemente exibe só completed', () => {
    cy.contains('Filmes Assistidos Recentemente', { timeout: 10000 }).should('be.visible')
    cy.contains('Filme Completo').should('be.visible')
    cy.contains('Filme Assistindo').should('not.exist')
    cy.contains('Filme Pretendo').should('not.exist')
  })

  it('Séries Assistidas Recentemente exibe só completed', () => {
    cy.contains('Séries Assistidas Recentemente', { timeout: 10000 }).should('exist')
    cy.contains('Série Completa').should('exist')
    cy.contains('Série Assistindo').should('not.exist')
  })

  it('Continue Assistindo exibe itens com status watching', () => {
    cy.contains('Continue Assistindo', { timeout: 10000 }).should('exist')
    cy.contains('Filme Assistindo').should('exist')
    cy.contains('Série Assistindo').should('exist')
  })
})
