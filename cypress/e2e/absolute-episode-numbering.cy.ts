/**
 * Cenário: séries com numeração absoluta de episódios (comum em anime — a T2 começa no ep. 62).
 * Os episódios assistidos são guardados pela POSIÇÃO na temporada ("2-1"), não pelo número do TMDB ("2-62").
 *  - Chaves antigas ("2-62") são migradas para a posição ao abrir a temporada
 *  - A lista continua exibindo o número real (62, 63, 64)
 *  - Finalizado → temporada aparece toda marcada e o checkbox oferece DESMARCAR (bug original)
 *  - Desmarcar temporada pede confirmação e remove só as chaves daquela temporada
 *
 * Dados: TMDB mockado via cy.intercept.
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

import fixture from '../fixtures/series-with-specials.json'

const SERIES_KEY = '@cinelist:series'
const ONBOARDING_KEY = '@cinelist:onboarding_done'

const tvDetail = {
  ...fixture.tmdbDetail,
  status: 'Returning Series',
  seasons: [
    { id: 9201, name: 'Temporada 1', season_number: 1, episode_count: 3, air_date: '2020-03-01' },
    { id: 9202, name: 'Temporada 2', season_number: 2, episode_count: 3, air_date: '2021-03-01' },
  ],
}

const episode = (season: number, number: number, name: string) => ({
  id: season * 1000 + number,
  episode_number: number,
  name,
  overview: '',
  air_date: null,
  vote_average: 0,
  still_path: null,
})

const season2Episodes = {
  season_number: 2,
  episodes: [episode(2, 62, 'Sessenta e dois'), episode(2, 63, 'Sessenta e três'), episode(2, 64, 'Sessenta e quatro')],
}

function visit(watchedEpisodes: string[], status = 'watching') {
  cy.visit(`/detail/${fixture.localItem.id}?mediaType=tv`, {
    onBeforeLoad(win) {
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([{ ...fixture.localItem, status, watchedEpisodes }]))
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    },
  })
  cy.wait('@tvDetail')
}

function savedEpisodes(win: Window): string[] {
  return JSON.parse(win.localStorage.getItem(SERIES_KEY) || '[]')[0].watchedEpisodes
}

describe('Numeração absoluta de episódios', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.intercept('GET', `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}*`, { body: tvDetail }).as('tvDetail')
    cy.intercept('GET', `https://api.themoviedb.org/3/tv/${fixture.localItem.tmdbId}/season/2*`, { body: season2Episodes }).as('season2')
  })

  it('migra chaves antigas ("2-62") para a posição ("2-1") ao abrir a temporada', () => {
    visit(['1-1', '1-2', '1-3', '2-62', '2-63', '2-64'])

    cy.contains('Temporada 2').click()
    cy.wait('@season2')

    // Número real continua visível na lista
    cy.get('[data-testid="episode-name-62"]').should('contain', '62')

    cy.window().should((win) => {
      const keys = savedEpisodes(win)
      expect(keys).to.include.members(['1-1', '1-2', '1-3', '2-1', '2-2', '2-3'])
      expect(keys).not.to.include.members(['2-62'])
      expect(keys.filter((k) => k.startsWith('2-'))).to.have.length(3)
    })
    cy.get('[data-testid="season-checkbox-2"]').should('contain', '✓')
  })

  it('marcar um episódio grava a posição, não o número do TMDB', () => {
    visit(['1-1', '1-2', '1-3'])

    cy.contains('Temporada 2').click()
    cy.wait('@season2')
    cy.get('[data-testid="episode-check-62"]').click()

    cy.window().should((win) => {
      const keys = savedEpisodes(win)
      expect(keys).to.include('2-1')
      expect(keys).not.to.include('2-62')
    })
  })

  it('após Finalizado, o checkbox da temporada oferece desmarcar (não "Marcar temporada?")', () => {
    visit([])

    cy.contains('Alterar').click()
    cy.get('[data-testid="status-option-completed"]').click()

    cy.get('[data-testid="season-checkbox-2"]').should('contain', '✓').click()
    cy.wait('@season2')

    cy.contains('Marcar temporada?').should('not.exist')
    cy.contains('Desmarcar temporada?').should('be.visible')
  })

  it('desmarcar temporada pede confirmação e remove só aquela temporada', () => {
    // Inclui uma chave antiga que sobrou para garantir que ela também é limpa
    visit(['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '2-64'])

    cy.get('[data-testid="season-checkbox-2"]').should('contain', '✓').click()
    cy.wait('@season2')
    cy.contains('Desmarcar todos os 3 episódios desta temporada?').should('be.visible')

    // Cancelar mantém tudo
    cy.contains('Cancelar').click()
    cy.contains('Desmarcar temporada?').should('not.exist')
    cy.get('[data-testid="season-checkbox-2"]').should('contain', '✓')

    // Confirmar desmarca só a T2
    cy.get('[data-testid="season-checkbox-2"]').click()
    cy.get('[data-testid="confirm-mark-season-btn"]').should('contain', 'Desmarcar').click()

    cy.window().should((win) => {
      const keys = savedEpisodes(win)
      expect(keys.filter((k) => k.startsWith('2-'))).to.have.length(0)
      expect(keys).to.include.members(['1-1', '1-2', '1-3'])
    })
    cy.get('[data-testid="season-checkbox-2"]').should('contain', '○')
  })
})
