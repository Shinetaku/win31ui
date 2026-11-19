import { expect, test } from '@playwright/test'

test.describe('Vite demo (Electron/Tauri renderer)', () => {
  test('renders the demo window', async ({ page }) => {
    await page.goto('/')
    const win = page.locator('.win31-window').first()
    await expect(win).toBeVisible()
    await expect(page.locator('.win31-titlebar-text').first()).toContainText('Win31 React Demo')
  })

  test('greet writes to the status bar', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox').first().fill('Ada')
    await page.getByRole('button', { name: 'Greet' }).click()
    await expect(page.locator('.win31-status-pane').first()).toContainText('Hello, Ada!')
  })

  test('manual drag moves the window', async ({ page }) => {
    await page.goto('/')
    const win = page.locator('.win31-window').first()
    const bar = win.locator('.win31-titlebar')
    await expect(win).toBeVisible()

    const box = await bar.boundingBox()
    if (!box) throw new Error('title bar not laid out')

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 40, { steps: 5 })
    await page.mouse.up()

    const style = await win.evaluate((el) => el.style.position)
    expect(style).toBe('fixed')
  })

  test('theme select switches the html attribute', async ({ page }) => {
    await page.goto('/')
    const root = page.locator('html')
    // light is the :root default and removes the attribute
    await expect(root).not.toHaveAttribute('data-win31-theme', /.+/)
    await page.locator('select').first().selectOption('dark')
    await expect(root).toHaveAttribute('data-win31-theme', 'dark')
    await page.locator('select').first().selectOption('light')
    await expect(root).not.toHaveAttribute('data-win31-theme', /.+/)
  })

  test('menu opens, selects an item and reports to the status bar', async ({ page }) => {
    await page.goto('/')
    await page.getByText('File', { exact: true }).click()
    const menuitem = page.getByRole('menuitem', { name: 'New' })
    await expect(menuitem).toBeVisible()
    await menuitem.click()
    await expect(page.locator('.win31-status-pane').first()).toContainText('New file.')
    await expect(page.getByRole('menuitem', { name: 'New' })).toHaveCount(0)
  })

  test('menu closes on Escape', async ({ page }) => {
    await page.goto('/')
    await page.getByText('File', { exact: true }).click()
    await expect(page.getByRole('menuitem', { name: 'New' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menuitem', { name: 'New' })).toHaveCount(0)
  })

  test('tabs switch panels and the table sorts by header button', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('tab', { name: 'Orders' }).click()
    const table = page.getByRole('table', { name: 'orders' })
    await expect(table).toBeVisible()
    await expect(table.getByRole('cell', { name: 'SO-2026-0001' })).toBeVisible()

    // Sorting lives on a button inside the column header.
    await table.getByRole('button', { name: /Numbers/ }).click()
    const firstCell = table.getByRole('row').nth(1).getByRole('cell').nth(2)
    await expect(firstCell).toHaveText('240')
  })

  test('listbox selects an option via keyboard', async ({ page }) => {
    await page.goto('/')
    const listbox = page.getByRole('listbox', { name: 'platform' })
    await listbox.click()
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await listbox.blur()
    // no crash + still exactly one selected option
    await expect(listbox.locator('.is-selected')).toHaveCount(1)
  })

  test('combobox filters and selects', async ({ page }) => {
    await page.goto('/')
    const combo = page.getByRole('combobox', { name: 'gateway' })
    await combo.fill('1')
    const option = page.getByRole('option', { name: '17' })
    await expect(option).toBeVisible()
    await option.click()
    await expect(combo).toHaveValue('17')
  })

  test('dialog opens from the toolbar and closes on Escape', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Dialog' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Onboarding Parameters')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('message box reports the pressed button', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'MessageBox' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('.win31-msg-icon.warn')).toBeVisible()
    await dialog.getByRole('button', { name: 'Yes' }).click()
    await expect(page.locator('.win31-status-pane').first()).toContainText('result: yes')
  })

  test('tree expands nodes and tooltip appears on hover', async ({ page }) => {
    await page.goto('/')
    const tree = page.getByRole('tree', { name: 'enterprise tree' })
    await page.getByRole('tab', { name: 'Enterprise Tree' }).click()
    await expect(tree).toBeVisible()
    await expect(tree.getByText('SO-0001')).toBeVisible() // defaultExpandedIds=['e1']
    await tree.getByText('Globex').click()
    await expect(tree.locator('.win31-tree-row', { hasText: 'Globex' })).toHaveClass(/is-current/)

    // The tooltip demo lives in the General tab panel.
    await page.getByRole('tab', { name: 'General' }).click()
    await page.getByText('Hover for help').hover()
    await expect(page.locator('.win31-tooltip')).toBeVisible({ timeout: 2000 })
  })

  test('desktop icon shows via View menu and restores on click', async ({ page }) => {
    await page.goto('/')
    await page.getByText('View', { exact: true }).click()
    await page.getByRole('menuitem', { name: 'Show desktop icon' }).click()
    const icon = page.locator('.win31-desktop-icon')
    await expect(icon).toBeVisible()
    await icon.click()
    await expect(page.locator('.win31-desktop-icon')).toHaveCount(0)
  })

  test('visual snapshot of the default view', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.win31-window').first()).toBeVisible()
    await expect(page).toHaveScreenshot('vite-app.png')
  })
})
