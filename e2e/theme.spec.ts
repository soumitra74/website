import { expect, test } from '../support/diagnostics'

const html = (page: import('@playwright/test').Page) => page.locator('html')

test.describe('theme toggle', () => {
  test('defaults to light', async ({ page }) => {
    await page.goto('/')
    await expect(html(page)).toHaveClass(/\blight\b/)
  })

  test('switching to Dark applies the class and persists across reloads', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Light/ }).click()
    await page.getByRole('button', { name: 'Dark' }).click()

    await expect(html(page)).toHaveClass(/\bdark\b/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')

    await page.reload()
    await expect(html(page)).toHaveClass(/\bdark\b/)
  })

  test('Ambient adds the ambient class alongside light or dark', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Light/ }).click()
    await page.getByRole('button', { name: 'Ambient' }).click()

    await expect(html(page)).toHaveClass(/\bambient\b/)
    await expect(html(page)).toHaveClass(/\b(light|dark)\b/)
  })

  test('dropdown closes when clicking outside', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Light/ }).click()
    await expect(page.getByRole('button', { name: 'Dark' })).toBeVisible()

    await page.mouse.click(5, 300)
    await expect(page.getByRole('button', { name: 'Dark' })).toBeHidden()
  })

  test('stored theme is honoured on first load', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
    await page.goto('/')
    await expect(html(page)).toHaveClass(/\bdark\b/)
  })
})
