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

  it('contém og:url, twitter:image e dimensões da imagem', () => {
    cy.get('meta[property="og:url"]').invoke('attr', 'content').should('not.be.empty')
    cy.get('meta[name="twitter:image"]').invoke('attr', 'content').should('match', /icon\.png$/)
    cy.get('meta[property="og:image:width"]').should('have.attr', 'content', '1254')
    cy.get('meta[property="og:image:height"]').should('have.attr', 'content', '1254')
  })

  // WhatsApp só mostra a imagem com URL absoluta. Em dev a variável costuma não existir,
  // então este teste só roda com: npx cypress run --env SITE_URL=https://seu-app.vercel.app
  it('og:image e og:url são absolutas quando EXPO_PUBLIC_SITE_URL está definida', function () {
    const siteUrl = Cypress.env('SITE_URL') as string | undefined
    if (!siteUrl) this.skip()

    const base = siteUrl!.replace(/\/$/, '')
    cy.get('meta[property="og:image"]').should('have.attr', 'content', `${base}/icon.png`)
    cy.get('meta[property="og:url"]').should('have.attr', 'content', `${base}/`)
  })
})
