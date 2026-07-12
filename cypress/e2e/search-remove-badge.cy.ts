/**
 * Cenário: na aba de Busca, deve adicionar um filme ou serie clicando no botao +, depois abre os detalhes desse filme/serie, clica na lixeira, e quando ocorrer redirect para a aba Busca novamente, o icone de checklist verde deve ser alterado novamente para o icone de + sem precisar dar F5 na pagina.
 *
 * Dados: 100% mockados via cy.intercept (TMDB bloqueia CORS de localhost).
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

const TMDB_TRENDING_MOVIE = 'https://api.themoviedb.org/3/trending/movie/week*'
const TMDB_TRENDING_TV    = 'https://api.themoviedb.org/3/trending/tv/week*'
const TMDB_MOVIE_DETAIL   = 'https://api.themoviedb.org/3/movie/999001*'

const mockMovieDetail = {
  id: 999001,
  title: 'Filme Teste Cypress',
  overview: 'Filme usado nos testes automatizados.',
  poster_path: null,
  release_date: '2024-01-01',
  vote_average: 8.0,
  runtime: 120,
  genres: [{ id: 1, name: 'Ação' }],
  credits: { cast: [], crew: [] },
}

describe('Busca — badge some após remoção na tela de detalhes', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)

    cy.intercept('GET', TMDB_TRENDING_MOVIE, { fixture: 'trending-movies.json' }).as('trendingMovies')
    cy.intercept('GET', TMDB_TRENDING_TV,    { fixture: 'trending-series.json' }).as('trendingSeries')
    cy.intercept('GET', TMDB_MOVIE_DETAIL,   { body: mockMovieDetail }).as('movieDetail')

    cy.visit('/search')
    cy.wait('@trendingMovies')
    cy.contains('Em alta', { timeout: 10000 }).should('be.visible')
  })

  it('ícone + vira ✓ ao adicionar e some ao remover via detalhe', () => {
    // Antes de adicionar: badge mostra +
    cy.get('[data-testid="trending-card"]').first().as('card')
    cy.get('@card').find('[data-testid="trending-add-btn"]').should('contain', '+')

    // Adiciona o filme mockado
    cy.get('@card').find('[data-testid="trending-add-btn"]').click()
    cy.contains('Assistindo').click()

    // Badge deve virar ✓
    cy.get('@card').find('[data-testid="trending-add-btn"]').should('contain', '✓')

    // Abre detalhes clicando no card
    cy.get('@card').click()
    cy.url().should('include', '/detail/')
    cy.wait('@movieDetail')

    // Remove via lixeira
    cy.get('[data-testid="detail-remove-btn"]').click()
    cy.get('[data-testid="confirm-remove-btn"]').click()

    // Volta para busca
    cy.url().should('include', '/search')
    cy.contains('Em alta', { timeout: 10000 }).should('be.visible')

    // Badge deve mostrar + imediatamente — sem F5
    cy.get('[data-testid="trending-card"]')
      .first()
      .find('[data-testid="trending-add-btn"]')
      .should('contain', '+')
  })
})
