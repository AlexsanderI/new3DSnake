import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const getRandomDirection = () => directions[Math.floor(Math.random() * directions.length)]
const durationMs = 5 * 60 * 1000

function shouldRotateDirection(previous: string, next: string) {
  if (previous === '' || previous === next) return true
  const reversePairs: Record<string, string> = {
    ArrowUp: 'ArrowDown',
    ArrowDown: 'ArrowUp',
    ArrowLeft: 'ArrowRight',
    ArrowRight: 'ArrowLeft',
  }
  return reversePairs[previous] !== next
}

async function writeLogFile(outputDir: string, name: string, content: string) {
  await fs.promises.mkdir(outputDir, { recursive: true })
  await fs.promises.writeFile(path.join(outputDir, name), content, 'utf8')
}

test('5 minutes of continuous snake gameplay with random directions', async ({
  page,
}, testInfo) => {
  const logs: string[] = []
  let lastFrameTimestamp = Date.now()

  page.on('console', (message) => {
    logs.push(`[console:${message.type()}] ${message.text()}`)
  })

  page.on('pageerror', (error) => {
    logs.push(`[pageerror] ${error.message}`)
  })

  page.on('requestfailed', (request) => {
    logs.push(`[requestfailed] ${request.url()} ${request.failure()?.errorText}`)
  })

  page.on('crash', () => {
    logs.push('[crash] page crashed')
  })

  await page.goto('/')
  await expect(page.locator('#root')).toBeVisible()

  await page.evaluate(() => {
    ;(window as any).__snakeHangDetector = { last: Date.now() }
    const tick = () => {
      ;(window as any).__snakeHangDetector.last = Date.now()
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  const startTime = Date.now()
  let previousDirection = ''
  let errorDetected = false

  try {
    while (Date.now() - startTime < durationMs) {
      const nextDirection = getRandomDirection()
      if (shouldRotateDirection(previousDirection, nextDirection)) {
        await page.keyboard.press(nextDirection)
        logs.push(`[action] pressed ${nextDirection}`)
        previousDirection = nextDirection
      }

      await page.waitForTimeout(1200 + Math.floor(Math.random() * 800))

      const currentLastFrame = await page.evaluate(
        () => (window as any).__snakeHangDetector?.last ?? 0,
      )
      if (Date.now() - currentLastFrame > 15000) {
        errorDetected = true
        const screenshotPath = path.join(testInfo.outputDir, 'hang-screenshot.png')
        await page.screenshot({ path: screenshotPath })
        logs.push('[hang] detected possible hang, saved screenshot')
        break
      }

      if (
        logs.some(
          (entry) =>
            entry.includes('[pageerror]') ||
            entry.includes('[crash]') ||
            entry.includes('[requestfailed]'),
        )
      ) {
        errorDetected = true
        const screenshotPath = path.join(testInfo.outputDir, 'error-screenshot.png')
        await page.screenshot({ path: screenshotPath })
        logs.push('[error] detected page error or crash, saved screenshot')
        break
      }
    }
  } finally {
    // ensure app cleans up (unmount, stop RAF, listeners) to avoid context teardown hangs
    await page.evaluate(() => {
      ;(window as any).__cleanupBootstrap?.()
    })

    await writeLogFile(testInfo.outputDir, 'snake-playback.log', logs.join('\n'))
  }

  if (errorDetected) {
    throw new Error(
      'Playwright detected a page error or hang during the 5-minute snake session. See test artifacts for details.',
    )
  }
})
