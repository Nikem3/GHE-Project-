import { defineConfig, devices } from '@playwright/test'
import { mkdirSync, rmSync } from 'node:fs'

const API_PORT = 3101
const WEB_PORT = 5174
const WEB = `http://localhost:${WEB_PORT}`

// Fresh DB each run (server auto-seeds when empty). Skipped in workers, which re-load this file.
if (!process.env.PW_TEST_WORKER_INDEX && !process.env.TEST_WORKER_INDEX) {
  rmSync('e2e/.tmp', { recursive: true, force: true })
  mkdirSync('e2e/.tmp', { recursive: true })
}

export default defineConfig({
  testDir: './e2e',
  workers: 1, // tests share one DB
  retries: 0,
  reporter: 'list',
  use: { baseURL: WEB, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `cd server && DB_PATH=../e2e/.tmp/e2e.db PORT=${API_PORT} CORS_ORIGIN=${WEB} node server.js`,
      url: `http://localhost:${API_PORT}/api/courses`,
      reuseExistingServer: false,
    },
    {
      command: `API_URL=http://localhost:${API_PORT} npx vite --port ${WEB_PORT} --strictPort`,
      url: WEB,
      reuseExistingServer: false,
    },
  ],
})
