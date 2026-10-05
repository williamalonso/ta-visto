// O service worker (public/sw.js) pode servir um bundle antigo do cache e mascarar mudanças.
// Nos testes ele nunca é registrado.
beforeEach(() => {
  cy.intercept('GET', '/sw.js', { statusCode: 404, body: '' })
})
