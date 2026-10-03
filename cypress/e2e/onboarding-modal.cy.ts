/**
 * Cenário: modal de onboarding aparece apenas na primeira vez que o app é aberto.
 *  - Sem flag no localStorage → modal visível com 3 blocos de features
 *  - Clicar "Começar" → modal fecha, flag salva, navega para /search
 *  - Segunda visita com flag → modal não aparece
 *
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

const ONBOARDING_KEY = '@cinelist:onboarding_done'
const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'

describe('Onboarding modal', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.window().then((win) => {
      win.localStorage.removeItem(ONBOARDING_KEY)
      win.localStorage.setItem(MOVIES_KEY, JSON.stringify([]))
      win.localStorage.setItem(SERIES_KEY, JSON.stringify([]))
    })
  })

  it('exibe o modal na primeira visita (sem flag)', () => {
    cy.visit('/')
    cy.get('[data-testid="onboarding-start-btn"]', { timeout: 10000 }).should('be.visible')
    cy.contains('Bem-vindo').should('be.visible')
    cy.contains('Busque').should('be.visible')
    cy.contains('Organize').should('be.visible')
    cy.contains('Acompanhe').should('be.visible')
  })

  it('fecha o modal, salva a flag e navega para busca ao clicar Começar', () => {
    cy.visit('/')
    cy.get('[data-testid="onboarding-start-btn"]', { timeout: 10000 }).click()

    cy.get('[data-testid="onboarding-start-btn"]').should('not.exist')

    cy.window().then((win) => {
      expect(win.localStorage.getItem(ONBOARDING_KEY)).to.equal('1')
    })

    cy.url().should('include', '/search')
  })

  it('não exibe o modal em visitas subsequentes (flag já salva)', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(ONBOARDING_KEY, '1')
    })
    cy.visit('/')
    cy.get('[data-testid="onboarding-start-btn"]').should('not.exist')
  })
})
