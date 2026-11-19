# -*- coding: utf-8 -*-
"""Generate README screenshots and demo GIFs from the running demos."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

OUT = Path("D:/Work/win31ui/docs/screenshots")
OUT.mkdir(parents=True, exist_ok=True)
DESKTOP = "http://127.0.0.1:5174/"
GALLERY = "http://127.0.0.1:5173/"
TMP = Path("D:/Work/win31ui/test-results/gifframes")
TMP.mkdir(parents=True, exist_ok=True)

VIEW = {"width": 1024, "height": 768}


def open_app(page, title):
    page.locator(".demo-group-item").filter(has_text=title).first.dblclick()
    page.wait_for_timeout(450)


def close_app(page, title):
    page.locator(".demo-window").filter(has_text=title).first.locator(
        '.win31-btn-control[data-btn="close"]'
    ).click()
    page.wait_for_timeout(250)


def save_gif(frames, name, durations=None, width=820):
    imgs = []
    for f in frames:
        im = Image.open(f).convert("RGB")
        ratio = width / im.width
        im = im.resize((width, int(im.height * ratio)), Image.LANCZOS)
        imgs.append(im.convert("P", palette=Image.ADAPTIVE, colors=64))
    durations = durations or [420] * len(imgs)
    imgs[0].save(
        OUT / name,
        save_all=True,
        append_images=imgs[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    size = (OUT / name).stat().st_size // 1024
    print(f"{name}: {len(imgs)} frames, {size} KB")


def frame(page, prefix, index):
    path = TMP / f"{prefix}-{index:02d}.png"
    page.screenshot(path=str(path))
    return path


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)

    # ---------- static screenshots ----------
    static_jobs = [
        ("desktop.png", "File Manager", None),
        ("file-manager.png", "File Manager", None),
        ("write.png", "Write", None),
        ("paintbrush.png", "Paintbrush", "paint"),
        ("control-panel.png", "Control Panel", "emerald"),
        ("calculator.png", "Calculator", "calc"),
        ("minesweeper.png", "Minesweeper", "mines"),
        ("solitaire.png", "Solitaire", "deal"),
    ]
    for name, app, extra in static_jobs:
        page = browser.new_page(viewport=VIEW)
        page.goto(DESKTOP)
        page.wait_for_timeout(700)
        if app != "File Manager" or name != "desktop.png":
            open_app(page, app)
        if extra == "paint":
            canvas = page.locator("canvas").first
            box = canvas.bounding_box()
            page.mouse.move(box["x"] + 40, box["y"] + 40)
            page.mouse.down()
            page.mouse.move(box["x"] + 240, box["y"] + 160, steps=10)
            page.mouse.up()
        elif extra == "emerald":
            page.get_by_role("radio", name="Emerald").check()
            page.wait_for_timeout(400)
        elif extra == "calc":
            for label in ("1", "2", "3", "+", "4", "5", "="):
                page.get_by_role("button", name=label, exact=True).first.click()
        elif extra == "mines":
            scope = page.locator(".demo-window").filter(has_text="Minesweeper")
            for i in range(3):
                scope.get_by_role("button").nth(30 + i * 4).click()
                page.wait_for_timeout(60)
        elif extra == "deal":
            page.get_by_role("button", name="Deal").click()
            page.wait_for_timeout(200)
        page.screenshot(path=str(OUT / name))
        page.close()
        print("saved", name)

    # component gallery (vite demo)
    page = browser.new_page(viewport={"width": 1180, "height": 900})
    page.goto(GALLERY)
    page.wait_for_timeout(1200)
    page.screenshot(path=str(OUT / "components.png"))
    page.close()
    print("saved components.png")

    # ---------- GIF 1: window management ----------
    page = browser.new_page(viewport=VIEW)
    page.goto(DESKTOP)
    page.wait_for_timeout(700)
    frames = [frame(page, "win", 0)]
    open_app(page, "Write")
    frames.append(frame(page, "win", 1))
    win = page.locator(".demo-window").filter(has_text="Write").first
    bar = win.locator(".win31-titlebar")
    box = bar.bounding_box()
    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    page.mouse.down()
    page.mouse.move(box["x"] + box["width"] / 2 + 120, box["y"] + box["height"] / 2 + 90, steps=8)
    page.mouse.up()
    page.wait_for_timeout(150)
    frames.append(frame(page, "win", 2))
    win.locator('.win31-btn-control[data-btn="min"]').click()
    page.wait_for_timeout(250)
    frames.append(frame(page, "win", 3))
    page.locator(".demo-group-item").filter(has_text="Write").first.dblclick()
    page.wait_for_timeout(300)
    frames.append(frame(page, "win", 4))
    page.close()
    save_gif(frames, "demo-windows.gif")

    # ---------- GIF 2: file manager ----------
    page = browser.new_page(viewport=VIEW)
    page.goto(DESKTOP)
    page.wait_for_timeout(700)
    open_app(page, "File Manager")
    page.wait_for_timeout(300)
    frames = [frame(page, "fm", 0)]
    tree = page.get_by_role("tree", name="directories")
    tree.get_by_text("WINDOWS", exact=True).click()
    page.wait_for_timeout(300)
    frames.append(frame(page, "fm", 1))
    tree.get_by_text("DOS", exact=True).click()
    page.wait_for_timeout(300)
    frames.append(frame(page, "fm", 2))
    page.get_by_role("button", name="Size").click()
    page.wait_for_timeout(300)
    frames.append(frame(page, "fm", 3))
    page.close()
    save_gif(frames, "demo-file-manager.gif")

    # ---------- GIF 3: calculator ----------
    page = browser.new_page(viewport=VIEW)
    page.goto(DESKTOP)
    page.wait_for_timeout(700)
    open_app(page, "Calculator")
    page.wait_for_timeout(250)
    frames = [frame(page, "calc", 0)]
    for label in ("1", "2", "+", "3", "4"):
        page.get_by_role("button", name=label, exact=True).first.click()
        page.wait_for_timeout(120)
        frames.append(frame(page, "calc", len(frames)))
    page.get_by_role("button", name="=", exact=True).first.click()
    page.wait_for_timeout(250)
    frames.append(frame(page, "calc", len(frames)))
    page.close()
    save_gif(frames, "demo-calculator.gif", durations=[500, 320, 320, 320, 320, 320, 900])

    # ---------- GIF 4: theme switch ----------
    page = browser.new_page(viewport=VIEW)
    page.goto(DESKTOP)
    page.wait_for_timeout(700)
    open_app(page, "Control Panel")
    page.wait_for_timeout(300)
    frames = [frame(page, "theme", 0)]
    for scheme in ("Emerald", "Dark", "Mahogany", "Windows Default"):
        page.get_by_role("radio", name=scheme).check()
        page.wait_for_timeout(400)
        frames.append(frame(page, "theme", len(frames)))
    page.close()
    save_gif(frames, "demo-themes.gif", durations=[500, 700, 700, 700, 900])

    # ---------- GIF 5: minesweeper ----------
    page = browser.new_page(viewport=VIEW)
    page.goto(DESKTOP)
    page.wait_for_timeout(700)
    open_app(page, "Minesweeper")
    page.wait_for_timeout(300)
    frames = [frame(page, "mine", 0)]
    scope = page.locator(".demo-window").filter(has_text="Minesweeper")
    for i in range(4):
        scope.get_by_role("button").nth(22 + i * 5).click()
        page.wait_for_timeout(220)
        frames.append(frame(page, "mine", len(frames)))
    page.close()
    save_gif(frames, "demo-minesweeper.gif", durations=[500, 420, 420, 420, 420, 800])

    browser.close()

print("DONE")
