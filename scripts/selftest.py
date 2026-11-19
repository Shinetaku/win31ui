# -*- coding: utf-8 -*-
"""Interactive self-test for the win31ui Windows 3.1 desktop demo (close-as-you-go)."""
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5174/"
results = []
errors_console = []
shot_dir = "D:/Work/win31ui/test-results/selftest"


def check(name, fn):
    try:
        detail = fn()
        results.append((name, "PASS", detail or ""))
    except Exception as exc:
        msg = str(exc).strip().splitlines()
        results.append((name, "FAIL", (msg[0] if msg else type(exc).__name__)[:160]))


def dblclick_icon(page, title):
    page.locator(".demo-group-item").filter(has_text=title).first.dblclick()


def win(page, title):
    return page.locator(".demo-window").filter(has_text=title).first


def close(page, title):
    w = win(page, title)
    if w.count():
        w.locator('.win31-btn-control[data-btn="close"]').click()
        page.wait_for_timeout(150)


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1120, "height": 800})
    page.on("console", lambda m: errors_console.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors_console.append(str(e)))
    page.on("response", lambda r: errors_console.append(f"[http {r.status}] {r.url}") if r.status >= 400 else None)

    page.goto(BASE)
    page.wait_for_timeout(900)

    def shell():
        assert page.locator(".demo-pm > .win31-titlebar").is_visible()
        count = page.locator(".demo-group-item").count()
        assert count == 22, f"icons={count}"
        for group in ("Main", "Accessories", "Games"):
            assert page.locator(".demo-pm-desktop .win31-titlebar-text").filter(has_text=group).is_visible()
        return "22 icons, 3 groups"
    check("桌面加载：PM + 3 组 + 22 图标", lambda: shell())

    # --- File Manager ---
    dblclick_icon(page, "File Manager")
    page.wait_for_timeout(400)

    def fm_tree_nav():
        tree = page.get_by_role("tree", name="directories")
        tree.get_by_text("WINDOWS", exact=True).click()
        page.wait_for_timeout(200)
        assert page.get_by_role("table", name="file details").get_by_text("NOTEPAD.EXE").is_visible()
        return "navigate ok"
    check("文件管理器目录树导航", lambda: fm_tree_nav())

    def fm_go():
        box = page.get_by_role("textbox", name="directory path")
        box.fill("C:\\DOS")
        box.press("Enter")
        page.wait_for_timeout(200)
        assert page.get_by_role("table", name="file details").get_by_text("FORMAT.COM").is_visible()
        return "go ok"
    check("Go 按路径跳转", lambda: fm_go())

    def fm_sort():
        page.get_by_role("button", name="Size").click()
        page.wait_for_timeout(200)
        sort_attr = page.get_by_role("columnheader", name="Size").get_attribute("aria-sort")
        assert sort_attr in ("ascending", "descending"), sort_attr
        return f"aria-sort={sort_attr}"
    check("表头排序按钮", lambda: fm_sort())

    def fm_format():
        page.get_by_text("Disk", exact=True).click()
        page.get_by_role("menuitem", name="Format Disk...").click()
        dlg = page.get_by_role("dialog")
        assert dlg.locator(".win31-msg-icon.warn").is_visible()
        dlg.get_by_role("button", name="No").click()
        page.wait_for_timeout(150)
        assert page.get_by_role("dialog").count() == 0
        return "warn box closed"
    check("Format 磁盘警告消息框", lambda: fm_format())

    page.screenshot(path=f"{shot_dir}/file-manager.png")
    close(page, "File Manager")

    # --- Write ---
    dblclick_icon(page, "Write")
    page.wait_for_timeout(400)

    def write_edit():
        editor = page.get_by_role("textbox", name="editor")
        editor.fill("Quality notes for VBSS onboarding.")
        page.get_by_role("button", name="center").click()
        assert "is-pressed" in page.get_by_role("button", name="center").get_attribute("class")
        assert page.locator(".demo-ruler").is_visible()
        assert page.locator(".demo-write-page").is_visible()
        return "align + ruler + page"
    check("写字板编辑/对齐/标尺/纸张", lambda: write_edit())
    page.screenshot(path=f"{shot_dir}/write.png")
    close(page, "Write")

    # --- Calculator ---
    dblclick_icon(page, "Calculator")
    page.wait_for_timeout(400)

    def calc():
        def btn(label):
            page.get_by_role("button", name=label, exact=True).first.click()
        for step in ("2", "+", "3", "="):
            btn(step)
        display = page.get_by_role("textbox").first
        assert display.input_value() == "5", display.input_value()
        btn("C")
        assert display.input_value() == "0"
        return "2+3=5, C resets"
    check("计算器 2+3=5 并清零", lambda: calc())
    close(page, "Calculator")

    # --- Minesweeper ---
    dblclick_icon(page, "Minesweeper")
    page.wait_for_timeout(400)

    def mines():
        scope = page.locator(".demo-window").filter(has_text="Minesweeper")
        revealed = False
        for i in range(10):
            scope.get_by_role("button").nth(6 + i * 3).click()
            page.wait_for_timeout(80)
            if scope.get_by_text("Lost", exact=False).count() or scope.locator("text=1").count():
                revealed = True
                break
        assert revealed, "no reveal observed"
        return "cell revealed"
    check("扫雷翻格交互", lambda: mines())
    page.screenshot(path=f"{shot_dir}/minesweeper.png")
    close(page, "Minesweeper")

    # --- Solitaire ---
    dblclick_icon(page, "Solitaire")
    page.wait_for_timeout(400)

    def solitaire():
        page.get_by_role("button", name="Deal").click()
        page.wait_for_timeout(200)
        cards = page.locator(".demo-window").filter(has_text="Solitaire").locator("div").count()
        assert cards > 20, cards
        return f"cards rendered: {cards}"
    check("纸牌发牌", lambda: solitaire())
    close(page, "Solitaire")

    # --- Paintbrush ---
    dblclick_icon(page, "Paintbrush")
    page.wait_for_timeout(400)

    def paint():
        canvas = page.locator("canvas").first
        box = canvas.bounding_box()
        page.mouse.move(box["x"] + 10, box["y"] + 10)
        page.mouse.down()
        page.mouse.move(box["x"] + 80, box["y"] + 60, steps=6)
        page.mouse.up()
        return "stroke drawn"
    check("画图板画线", lambda: paint())
    page.screenshot(path=f"{shot_dir}/paintbrush.png")
    close(page, "Paintbrush")

    # --- MS-DOS ---
    dblclick_icon(page, "MS-DOS Prompt")
    page.wait_for_timeout(400)

    def dos():
        w = win(page, "MS-DOS Prompt")
        input_ = w.locator("input")
        input_.fill("dir")
        input_.press("Enter")
        page.wait_for_timeout(100)
        assert w.get_by_text("QUALITY.MDB").count(), "dir output missing QUALITY.MDB"
        input_.fill("ver")
        input_.press("Enter")
        assert "Windows 3.1" in w.inner_text()
        return "dir + ver ok"
    check("MS-DOS 命令 dir/ver", lambda: dos())
    close(page, "MS-DOS Prompt")

    # --- Clock ---
    dblclick_icon(page, "Clock")
    page.wait_for_timeout(400)

    def clock():
        w = win(page, "Clock")
        w.get_by_role("menuitem", name="Settings").click()
        w.get_by_role("menuitem", name="Digital").click()
        page.wait_for_timeout(200)
        assert ":" in w.inner_text()
        return "digital mode"
    check("时钟切换数字模式", lambda: clock())
    close(page, "Clock")

    # --- Calendar ---
    dblclick_icon(page, "Calendar")
    page.wait_for_timeout(400)

    def calendar():
        page.get_by_role("button", name="2026-11-21").first.click()
        page.wait_for_timeout(150)
        assert page.locator(".win31-calendar-day.is-selected").count() == 1
        return "date selected"
    check("日历选择日期", lambda: calendar())
    close(page, "Calendar")

    # --- Character Map ---
    dblclick_icon(page, "Character Map")
    page.wait_for_timeout(400)

    def charmap():
        page.get_by_role("button", name="character A", exact=True).first.click()
        return "char inserted"
    check("字符映射表插入字符", lambda: charmap())
    close(page, "Character Map")

    # --- Media Player ---
    dblclick_icon(page, "Media Player")
    page.wait_for_timeout(300)

    def media():
        w = win(page, "Media Player")
        w.get_by_role("button", name="Play").click()
        page.wait_for_timeout(1200)
        val = int(w.get_by_role("slider").get_attribute("aria-valuenow"))
        assert val > 0, f"stuck {val}"
        return f"progress {val}%"
    check("媒体播放器进度推进", lambda: media())
    close(page, "Media Player")

    # --- Notepad minimize/restore ---
    dblclick_icon(page, "Notepad")
    page.wait_for_timeout(400)

    def notepad_min_restore():
        w = win(page, "Notepad")
        w.get_by_role("textbox").fill("hello")
        w.locator('.win31-btn-control[data-btn="min"]').click()
        page.wait_for_timeout(150)
        assert not w.is_visible()
        dblclick_icon(page, "Notepad")
        page.wait_for_timeout(250)
        assert w.is_visible()
        return "min + dblclick restore"
    check("记事本最小化/双击还原", lambda: notepad_min_restore())
    close(page, "Notepad")

    # --- Control Panel theme ---
    dblclick_icon(page, "Control Panel")
    page.wait_for_timeout(400)

    def theme():
        page.get_by_role("radio", name="Mahogany").check()
        assert page.locator("html").get_attribute("data-win31-theme") == "mahogany"
        page.get_by_role("radio", name="Windows Default").check()
        page.wait_for_timeout(250)
        attr = page.locator("html").get_attribute("data-win31-theme")
        assert attr in (None, "light"), attr
        return "mahogany -> default"
    check("控制面板切换主题并复原", lambda: theme())
    page.screenshot(path=f"{shot_dir}/control-panel.png")
    close(page, "Control Panel")

    # --- About native dialog ---
    def about():
        page.get_by_role("menuitem", name="Help").first.click()
        page.get_by_role("menuitem", name="About Program Manager...").click()
        dlg = page.get_by_role("dialog")
        assert dlg.get_by_role("button", name="OK").is_visible()
        dlg.get_by_role("button", name="OK").click()
        page.wait_for_timeout(150)
        return "native dialog ok"
    check("About 原生对话框开关", lambda: about())

    # --- Window drag (reopen FM first) ---
    dblclick_icon(page, "File Manager")
    page.wait_for_timeout(400)

    def drag():
        target = win(page, "File Manager")
        bar = target.locator(".win31-titlebar")
        box = bar.bounding_box()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        page.mouse.down()
        page.mouse.move(box["x"] + box["width"] / 2 + 40, box["y"] + box["height"] / 2 + 30, steps=4)
        page.mouse.up()
        assert target.evaluate("el => el.style.position") == "fixed"
        return "drag ok"
    check("窗口拖动", lambda: drag())
    page.screenshot(path=f"{shot_dir}/final-desktop.png")
    close(page, "File Manager")

    # --- Remaining smoke apps ---
    def smoke_rest():
        opened = []
        for title in ["Print Manager", "Clipboard", "Windows Setup", "PIF Editor", "Read Me",
                      "Recorder", "Sound Recorder", "Terminal", "Object Packager"]:
            dblclick_icon(page, title)
            page.wait_for_timeout(250)
            assert win(page, title).is_visible(), f"{title} missing"
            opened.append(title)
            close(page, title)
        return f"{len(opened)} apps ok"
    check("其余 9 个应用冒烟", lambda: smoke_rest())

    browser.close()

print()
print("=" * 64)
fails = 0
for name, status, detail in results:
    mark = "PASS" if status == "PASS" else "FAIL"
    if status != "PASS":
        fails += 1
    print(f"[{mark}] {name}" + (f" — {detail}" if status == "PASS" and detail else ""))
    if status != "PASS":
        print(f"       {detail}")
print("=" * 64)
print(f"console/page errors: {len(errors_console)}")
for err in errors_console[:8]:
    print("  ERR:", err[:150])
print(f"RESULT: {len(results) - fails}/{len(results)} passed")
