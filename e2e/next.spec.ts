import { expect, test } from '@playwright/test'

test.describe('Next.js SSR demo', () => {
  test('server HTML already contains static and client-subtree markup', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toContain('win31-window')
    expect(html).toContain('Server Rendered Window')
    expect(html).toContain('win31-statusbar')
    expect(html).toContain('data-win31-theme="light"')
    // client-boundary subtree is still server-rendered
    expect(html).toContain('win31-menubar')
    expect(html).toContain('Contacts')
    expect(html).toContain('win31-groupbox')
  })

  test('hydrates without console or page errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(String(error)))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await page.goto('/')
    await expect(page.locator('.win31-window').first()).toBeVisible()
    const hydrationIssues = errors.filter((text) => /hydrat|mismatch|error/i.test(text))
    expect(hydrationIssues, errors.join('\n')).toEqual([])
  })

  test('interactive controls still work after hydration', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox').first().fill('typed client-side')
    await expect(page.getByRole('textbox').first()).toHaveValue('typed client-side')
    await page.getByRole('button', { name: 'Reset' }).click()
  })

  test('theme switcher toggles the html attribute', async ({ page }) => {
    await page.goto('/')
    await page.locator('select').selectOption('dark')
    await expect(page.locator('html')).toHaveAttribute('data-win31-theme', 'dark')
  })

  test('client table sorts via header button', async ({ page }) => {
    await page.goto('/')
    const table = page.getByRole('table', { name: 'contacts' })
    await expect(table).toBeVisible()
    await table.getByRole('button', { name: /Name/ }).click()
    await expect(table.getByRole('row').nth(1).getByRole('cell').first()).toHaveText('Chen Wei')
  })

  test('client dialog opens from the menu and closes on Escape', async ({ page }) => {
    await page.goto('/')
    await page.getByText('File', { exact: true }).click()
    await page.getByRole('menuitem', { name: 'Open dialog...' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Open Order')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('message box shows info icon and closes on OK', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Help', { exact: true }).click()
    await page.getByRole('menuitem', { name: 'About...' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.locator('.win31-msg-icon.info')).toBeVisible()
    await dialog.getByRole('button', { name: 'OK' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('visual snapshot of the SSR page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.win31-window').first()).toBeVisible()
    await expect(page).toHaveScreenshot('next-app.png')
  })
})
