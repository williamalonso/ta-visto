const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'

// Salva dados reais antes do teste e restaura depois
// Nunca apaga dados do usuário
beforeEach(() => {
  cy.window().then((win) => {
    const movies = win.localStorage.getItem(MOVIES_KEY)
    const series = win.localStorage.getItem(SERIES_KEY)
    Cypress.env('_backup_movies', movies)
    Cypress.env('_backup_series', series)
    // Injeta listas vazias para o teste começar sem itens salvos
    win.localStorage.setItem(MOVIES_KEY, '[]')
    win.localStorage.setItem(SERIES_KEY, '[]')
  })
})

afterEach(() => {
  cy.window().then((win) => {
    const movies = Cypress.env('_backup_movies')
    const series = Cypress.env('_backup_series')
    if (movies !== null) win.localStorage.setItem(MOVIES_KEY, movies)
    else win.localStorage.removeItem(MOVIES_KEY)
    if (series !== null) win.localStorage.setItem(SERIES_KEY, series)
    else win.localStorage.removeItem(SERIES_KEY)
  })
})
