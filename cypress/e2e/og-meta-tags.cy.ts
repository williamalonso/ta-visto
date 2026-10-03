/**
 * Cenário: a página deve conter as meta tags Open Graph e Twitter Card
 * necessárias para o preview funcionar ao compartilhar no WhatsApp e redes sociais.
 *
 * Pré-requisito: expo web rodando em http://localhost:8081
 * Run: npm run cy:open  (ou npm run cy:run)
 */

describe('Open Graph meta tags', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.visit('/')
  })

  it('contém og:title com conteúdo', () => {
    cy.get('meta[property="og:title"]')
      .should('exist')
      .invoke('attr', 'content')
      .should('not.be.empty')
  })

  it('contém og:description com conteúdo', () => {
    cy.get('meta[property="og:description"]')
      .should('exist')
      .invoke('attr', 'content')
      .should('not.be.empty')
  })

  it('contém og:image com conteúdo', () => {
    cy.get('meta[property="og:image"]')
      .should('exist')
      .invoke('attr', 'content')
      .should('not.be.empty')
  })

  it('contém og:type', () => {
    cy.get('meta[property="og:type"]').should('exist')
  })

  it('contém twitter:card', () => {
    cy.get('meta[name="twitter:card"]')
      .should('exist')
      .invoke('attr', 'content')
      .should('not.be.empty')
  })
})
