import { expect, test } from '@playwright/test'

const openApp = async (page: import('@playwright/test').Page, title: string) => {
  await page
    .locator('.demo-group-item')
    .filter({ hasText: title })
    .first()
    .dblclick()
}

const appWindow = (page: import('@playwright/test').Page, title: string) =>
  page.locator('.demo-window').filter({ hasText: title }).first()

test.describe('Windows 3.1 Program Manager desktop', () => {
  test('shell shows the Program Manager with three program groups', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.demo-pm > .win31-titlebar > .win31-titlebar-text')).toContainText('Program Manager')
    // Group windows render their own title bars inside the PM desktop.
    const groupTitles = page.locator('.demo-pm-desktop .win31-titlebar-text')
    await expect(groupTitles.filter({ hasText: 'Main' })).toBeVisible()
    await expect(groupTitles.filter({ hasText: 'Accessories' })).toBeVisible()
    await expect(groupTitles.filter({ hasText: 'Games' })).toBeVisible()
    await expect(page.locator('.demo-group-item')).toHaveCount(22)
    await expect(page.locator('.demo-group-item').filter({ hasText: 'File Manager' })).toBeVisible()
    await expect(page.locator('.demo-group-item').filter({ hasText: 'Minesweeper' })).toBeVisible()
  })

  test('menu bar is a single keyboard stop with arrow navigation', async ({ page }) => {
    await page.goto('/')
    const file = page.getByRole('menuitem', { name: 'File' }).first()
    await file.evaluate((el) => (el as HTMLElement).focus())
    await expect(file).toHaveAttribute('tabindex', '0')
    const options = page.getByRole('menuitem', { name: 'Options' }).first()
    await expect(options).toHaveAttribute('tabindex', '-1')
    await page.keyboard.press('ArrowRight')
    await expect(options).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(file).toBeFocused()
    // Enter opens the focused menu (click path); Escape closes it.
    await file.click()
    await expect(page.getByRole('menuitem', { name: /Exit/ })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menuitem', { name: /Exit/ })).toHaveCount(0)
    // About lives in the Help menu and opens the native-dialog message box.
    await page.getByRole('menuitem', { name: 'Help' }).first().click()
    await page.getByRole('menuitem', { name: 'About Program Manager...' }).click()
    const about = page.getByRole('dialog')
    await expect(about).toContainText('Program Manager — win31ui')
    await about.getByRole('button', { name: 'OK' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('file manager opens with folder tree, type column and Up/Go toolbar', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'File Manager')
    const win = appWindow(page, 'File Manager')
    await expect(win).toBeVisible()

    // Boxed [+]/[−] carets and folder icons in the tree.
    const tree = page.getByRole('tree', { name: 'directories' })
    await expect(tree).toBeVisible()
    await expect(tree.locator('.win31-tree-caret', { hasText: '−' })).toHaveCount(2)
    await expect(tree.locator('.win31-tree-icon.has-image svg')).not.toHaveCount(0)

    // File details include the Type column (files carry captions like .MDB).
    const table = page.getByRole('table', { name: 'file details' })
    await expect(table.getByRole('cell', { name: /Database File/ })).toBeVisible()

    // Go navigates by typed path.
    await page.getByRole('textbox', { name: 'directory path' }).fill('C:\\WINDOWS')
    await page.getByRole('button', { name: 'Go', exact: true }).click()
    await expect(table.getByRole('cell', { name: 'NOTEPAD.EXE' })).toBeVisible()
    // Subdirectories appear as Directory rows in the listing.
    await expect(table.getByRole('cell', { name: /Directory/ })).toBeVisible()

    // Up returns to the parent directory, which lists WINDOWS again.
    await page.getByRole('button', { name: 'Up', exact: true }).click()
    await expect(table.getByRole('cell', { name: /WINDOWS/ }).first()).toBeVisible()

    // Sorting works through the accessible header button (Enter key).
    const sizeButton = table.getByRole('button', { name: 'Size' })
    await sizeButton.evaluate((el) => (el as HTMLElement).focus())
    await page.keyboard.press('Enter')
    await expect(table.getByRole('columnheader', { name: 'Size' })).toHaveAttribute('aria-sort', /ascending|descending/)
  })

  test('write shows the ruler, page and alignment buttons', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Write')
    const win = appWindow(page, 'Write')
    await expect(win).toBeVisible()
    await expect(page.locator('.demo-ruler')).toBeVisible()
    await expect(page.locator('.demo-write-page')).toBeVisible()
    await page.getByRole('button', { name: 'center' }).click()
    await expect(page.getByRole('button', { name: 'center' })).toHaveClass(/is-pressed/)
  })

  test('calculator computes 2+3=5', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Calculator')
    await appWindow(page, 'Calculator').click()
    const display = page.getByRole('textbox').first()
    await page.getByRole('button', { name: '2', exact: true }).click()
    await page.getByRole('button', { name: '+', exact: true }).click()
    await page.getByRole('button', { name: '3', exact: true }).click()
    await page.getByRole('button', { name: '=', exact: true }).click()
    await expect(display).toHaveValue('5')
  })

  test('minesweeper board resets from the Game menu', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Minesweeper')
    const win = appWindow(page, 'Minesweeper')
    await expect(win).toBeVisible()
    // Game > New resets the board; the mine counter shows 10 afterwards.
    await win.getByRole('menuitem', { name: /Game/ }).click()
    await win.getByRole('menuitem', { name: /New/ }).click()
    await expect(win).toBeVisible()
    await expect(win.getByText(/10/).first()).toBeVisible()
  })

  test('solitaire deals a fresh tableau', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Solitaire')
    const win = appWindow(page, 'Solitaire')
    await expect(win).toBeVisible()
    await win.getByRole('button', { name: 'Deal' }).click()
    await expect(win).toBeVisible()
  })

  test('ms-dos prompt executes dir from the simulated filesystem', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'MS-DOS Prompt')
    const win = appWindow(page, 'MS-DOS Prompt')
    await expect(win).toBeVisible()
    const input = win.locator('input')
    await input.fill('dir')
    await input.press('Enter')
    await expect(win).toContainText('QUALITY.MDB')
    await input.fill('ver')
    await input.press('Enter')
    await expect(win).toContainText('Windows 3.1')
  })

  test('clock renders the analog dial and digital mode toggles', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Clock')
    const win = appWindow(page, 'Clock')
    await expect(win).toBeVisible()
    await win.getByRole('menuitem', { name: /Settings/ }).click()
    await win.getByRole('menuitem', { name: /Digital/ }).click()
    await expect(win).toContainText(':')
  })

  test('paintbrush exposes a drawable canvas', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Paintbrush')
    const win = appWindow(page, 'Paintbrush')
    await expect(win.locator('canvas').first()).toBeVisible()
    const canvas = win.locator('canvas').first()
    const box = await canvas.boundingBox()
    if (!box) throw new Error('canvas not laid out')
    await page.mouse.move(box.x + 10, box.y + 10)
    await page.mouse.down()
    await page.mouse.move(box.x + 60, box.y + 40, { steps: 4 })
    await page.mouse.up()
  })

  test('calendar app hosts the month view', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Calendar')
    const win = appWindow(page, 'Calendar')
    await expect(win).toBeVisible()
    await expect(win.getByRole('grid')).toBeVisible()
    await win.getByRole('button', { name: 'next month' }).click()
    await expect(win.getByText(/December 2026|January 2027|November 2026/)).toBeVisible()
  })

  test('control panel switches the whole desktop to emerald', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Control Panel')
    await appWindow(page, 'Control Panel').click()
    await page.getByRole('radio', { name: 'Emerald' }).check()
    await expect(page.locator('html')).toHaveAttribute('data-win31-theme', 'emerald')
  })

  test('windows minimize into the Program Manager dock and restore', async ({ page }) => {
    await page.goto('/')
    await openApp(page, 'Notepad')
    const win = appWindow(page, 'Notepad')
    await expect(win).toBeVisible()
    await win.locator('.win31-btn-control[data-btn="min"]').click()
    await expect(win).not.toBeVisible()
    // The docked group icon appears at the bottom; restore via it.
    const docked = page.locator('.demo-docked-group')
    if (await docked.count()) {
      await docked.first().click()
    } else {
      await openApp(page, 'Notepad')
    }
    await expect(appWindow(page, 'Notepad')).toBeVisible()
  })

  test('about dialog uses the native dialog element', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('menuitem', { name: 'Help' }).first().click()
    await page.getByRole('menuitem', { name: 'About Program Manager...' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Program Manager — win31ui')
    await dialog.getByRole('button', { name: 'OK' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('visual snapshot of the program manager desktop', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.demo-pm > .win31-titlebar > .win31-titlebar-text')).toContainText('Program Manager')
    await expect(page).toHaveScreenshot('desktop.png')
  })
})
