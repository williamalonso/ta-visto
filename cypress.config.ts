import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    viewportWidth: 390,
    viewportHeight: 844,
    defaultCommandTimeout: 10000,
  },
})
