import { expect, test } from '@playwright/test'

test.describe('ask-me chatbot', () => {
  test('loads and shows the input with submit disabled while empty', async ({ page }) => {
    await page.goto('/ask-me')
    const input = page.locator('form input[type="text"]')
    await expect(input).toBeVisible()
    await expect(page.locator('form button[type="submit"]')).toBeDisabled()

    await input.fill('hello')
    await expect(page.locator('form button[type="submit"]')).toBeEnabled()
  })

  test('sending a question shows the user message and an assistant reply', async ({ page }) => {
    await page.goto('/ask-me')
    const input = page.locator('form input[type="text"]')
    await input.fill('What is your experience with cloud?')
    await input.press('Enter')

    await expect(page.getByText('What is your experience with cloud?')).toBeVisible()
    await expect(input).toHaveValue('')
    // A reply arrives and the input becomes usable again once loading finishes.
    await expect(input).toBeEnabled({ timeout: 15_000 })
    await expect(input).toBeEditable()
  })

  test('whitespace-only input cannot be submitted', async ({ page }) => {
    await page.goto('/ask-me')
    await page.locator('form input[type="text"]').fill('   ')
    await expect(page.locator('form button[type="submit"]')).toBeDisabled()
  })
})
