import type { ComponentType } from 'react'
import { FileManagerApp } from './apps/file-manager'
import { ControlPanelDemo } from './apps/control-panel'
import { WriteApp } from './apps/write'
import { PrintManagerApp } from './apps/print-manager'
import { ClipboardApp } from './apps/clipboard'
import { MsDosApp } from './apps/msdos'
import { WindowsSetupApp } from './apps/setup'
import { PifEditorApp } from './apps/pif-editor'
import { ReadMeApp } from './apps/read-me'
import { NotepadApp } from './apps/notepad'
import { PaintbrushApp } from './apps/paintbrush'
import { CalculatorApp } from './apps/calculator'
import { CalendarApp } from './apps/calendar-app'
import { ClockApp } from './apps/clock'
import { CharacterMapApp } from './apps/char-map'
import { MediaPlayerApp } from './apps/media-player'
import { SoundRecorderApp } from './apps/sound-recorder'
import { RecorderApp } from './apps/recorder'
import { TerminalApp } from './apps/terminal'
import { ObjectPackagerApp } from './apps/packager'
import { SolitaireApp } from './apps/solitaire'
import { MinesweeperApp } from './apps/minesweeper'

/** Props every demo application window content receives. */
export interface AppWindowProps {
  onClose: () => void
}

export type AppGroupId = 'main' | 'accessories' | 'games' | 'startup'

export interface AppDef {
  id: string
  title: string
  /** Icon id from icons-data. */
  icon: string
  group: AppGroupId
  component: ComponentType<AppWindowProps>
  width: number
  height?: number
}

export const groupTitles: Record<AppGroupId, string> = {
  main: 'Main',
  accessories: 'Accessories',
  games: 'Games',
  startup: 'StartUp'
}

/** Program Manager registry: every application window, grouped by folder. */
export const apps: Array<AppDef> = [
  // Main
  { id: 'filemanager', title: 'File Manager', icon: 'filemanager', group: 'main', component: FileManagerApp, width: 720, height: 430 },
  { id: 'control', title: 'Control Panel', icon: 'control', group: 'main', component: ControlPanelDemo, width: 460 },
  { id: 'printmanager', title: 'Print Manager', icon: 'printmanager', group: 'main', component: PrintManagerApp, width: 520 },
  { id: 'clipboard', title: 'Clipboard', icon: 'clipboard', group: 'main', component: ClipboardApp, width: 480, height: 340 },
  { id: 'msdos', title: 'MS-DOS Prompt', icon: 'dos', group: 'main', component: MsDosApp, width: 600, height: 380 },
  { id: 'setup', title: 'Windows Setup', icon: 'setup', group: 'main', component: WindowsSetupApp, width: 500, height: 360 },
  { id: 'pifeditor', title: 'PIF Editor', icon: 'pifeditor', group: 'main', component: PifEditorApp, width: 520, height: 420 },
  { id: 'readme', title: 'Read Me', icon: 'readme', group: 'main', component: ReadMeApp, width: 520, height: 380 },
  // Accessories
  { id: 'write', title: 'Write', icon: 'write', group: 'accessories', component: WriteApp, width: 600, height: 420 },
  { id: 'paintbrush', title: 'Paintbrush', icon: 'paintbrush', group: 'accessories', component: PaintbrushApp, width: 740, height: 470 },
  { id: 'notepad', title: 'Notepad', icon: 'notepad', group: 'accessories', component: NotepadApp, width: 480, height: 360 },
  { id: 'recorder', title: 'Recorder', icon: 'recorder', group: 'accessories', component: RecorderApp, width: 460, height: 340 },
  { id: 'calendar', title: 'Calendar', icon: 'calendar', group: 'accessories', component: CalendarApp, width: 560, height: 380 },
  { id: 'calculator', title: 'Calculator', icon: 'calculator', group: 'accessories', component: CalculatorApp, width: 340, height: 430 },
  { id: 'clock', title: 'Clock', icon: 'clock', group: 'accessories', component: ClockApp, width: 320, height: 320 },
  { id: 'packager', title: 'Object Packager', icon: 'packager', group: 'accessories', component: ObjectPackagerApp, width: 560, height: 320 },
  { id: 'charmap', title: 'Character Map', icon: 'charmap', group: 'accessories', component: CharacterMapApp, width: 520, height: 400 },
  { id: 'mediaplayer', title: 'Media Player', icon: 'mediaplayer', group: 'accessories', component: MediaPlayerApp, width: 480, height: 260 },
  { id: 'soundrecorder', title: 'Sound Recorder', icon: 'soundrecorder', group: 'accessories', component: SoundRecorderApp, width: 440, height: 300 },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', group: 'accessories', component: TerminalApp, width: 560, height: 360 },
  // Games
  { id: 'solitaire', title: 'Solitaire', icon: 'solitaire', group: 'games', component: SolitaireApp, width: 620, height: 460 },
  { id: 'minesweeper', title: 'Minesweeper', icon: 'minesweeper', group: 'games', component: MinesweeperApp, width: 360, height: 380 }
]
