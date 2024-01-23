import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['backend/tests/*.test.js'],
    watch: true,
    open: true,
  },
})