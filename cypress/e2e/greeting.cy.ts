/**
 * Cenário: a saudação no cabeçalho da home deve variar conforme o horário.
 *  - 00h–04h59 → "Boa madrugada,"
 *  - 05h–11h59 → "Bom dia,"
 *  - 12h–17h59 → "Boa tarde,"
 *  - 18h–23h59 → "Boa noite,"
 *
 * Usa cy.clock() para controlar o horário do sistema.
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

const ONBOARDING_KEY = '@cinelist:onboarding_done'

function visitWithHour(hour: number) {
  cy.clock(new Date(2024, 0, 15, hour, 30, 0).getTime())
  cy.window().then((win) => {
    win.localStorage.setItem(ONBOARDING_KEY, '1')
  })
  cy.visit('/')
}

describe('Saudação por horário', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
  })

  it('exibe "Boa madrugada," entre 00h e 04h', () => {
    visitWithHour(2)
    cy.contains('Boa madrugada,', { timeout: 10000 }).should('be.visible')
  })

  it('exibe "Bom dia," entre 05h e 11h', () => {
    visitWithHour(9)
    cy.contains('Bom dia,', { timeout: 10000 }).should('be.visible')
  })

  it('exibe "Boa tarde," entre 12h e 17h', () => {
    visitWithHour(15)
    cy.contains('Boa tarde,', { timeout: 10000 }).should('be.visible')
  })

  it('exibe "Boa noite," entre 18h e 23h', () => {
    visitWithHour(21)
    cy.contains('Boa noite,', { timeout: 10000 }).should('be.visible')
  })
})
