export interface FsFile {
  name: string
  /** Size in bytes; directories report 0 and render no size. */
  size: number
  modified: string
  time: string
  /** File type caption shown by the File Manager (e.g. `BAT File`). */
  type: string
  /** True when this entry is a directory row of the parent listing. */
  directory?: boolean
  /** Directory id (row links into the tree). */
  dirId?: string
}

export interface FsDir {
  id: string
  label: string
  path: string
  children?: Array<FsDir>
  files: Array<FsFile>
}

export function dirRow(dir: FsDir): FsFile {
  return {
    name: dir.label,
    size: 0,
    modified: dir.files[0]?.modified ?? '11/18/26',
    time: '09:55:08',
    type: 'Directory',
    directory: true,
    dirId: dir.id
  }
}

/** Simulated C: drive shown by the File Manager. */
export const driveTree: Array<FsDir> = [
  {
    id: 'c',
    label: 'C:\\',
    path: 'C:\\',
    files: [
      { name: 'AUTOEXEC.BAT', size: 512, modified: '10/1/91', time: '17:00:00', type: 'BAT File' },
      { name: 'CONFIG.SYS', size: 384, modified: '10/1/91', time: '17:00:00', type: 'SYS File' }
    ],
    children: [
      {
        id: 'documents',
        label: 'DOCUMENTS',
        path: 'C:\\DOCUMENTS',
        files: [
          { name: 'ONBOARDING.DOC', size: 143_360, modified: '11/18/26', time: '14:02:11', type: 'Write Document' },
          { name: 'PLAN.WRI', size: 25_088, modified: '11/17/26', time: '10:31:40', type: 'Write Document' }
        ]
      },
      {
        id: 'temp',
        label: 'TEMP',
        path: 'C:\\TEMP',
        files: [{ name: '~DF0A31.TMP', size: 1_024, modified: '11/19/26', time: '08:12:44', type: 'Temporary File' }]
      },
      {
        id: 'windows',
        label: 'WINDOWS',
        path: 'C:\\WINDOWS',
        files: [
          { name: 'WIN.COM', size: 24_512, modified: '3/10/92', time: '17:00:00', type: 'System File' },
          { name: 'WIN.INI', size: 8_192, modified: '11/19/26', time: '09:55:08', type: 'Settings File' },
          { name: 'SYSTEM.INI', size: 4_096, modified: '11/18/26', time: '21:12:03', type: 'Settings File' },
          { name: 'NOTEPAD.EXE', size: 33_792, modified: '3/10/92', time: '17:00:00', type: 'Application' },
          { name: 'WRITE.EXE', size: 214_528, modified: '3/10/92', time: '17:00:00', type: 'Application' },
          { name: 'WINFILE.EXE', size: 146_368, modified: '3/10/92', time: '17:00:00', type: 'Application' },
          { name: 'CONTROL.EXE', size: 58_880, modified: '3/10/92', time: '17:00:00', type: 'Application' }
        ],
        children: [
          {
            id: 'system',
            label: 'SYSTEM',
            path: 'C:\\WINDOWS\\SYSTEM',
            files: [
              { name: 'KRNL386.EXE', size: 1_064_960, modified: '3/10/92', time: '17:00:00', type: 'Application' },
              { name: 'USER.EXE', size: 280_576, modified: '3/10/92', time: '17:00:00', type: 'Application' },
              { name: 'GDI.EXE', size: 220_672, modified: '3/10/92', time: '17:00:00', type: 'Application' },
              { name: 'SHELL.DLL', size: 20_352, modified: '3/10/92', time: '17:00:00', type: 'Application Extension' }
            ]
          }
        ]
      },
      {
        id: 'vbss',
        label: 'VBSS',
        path: 'C:\\VBSS',
        files: [
          { name: 'QUALITY.MDB', size: 2_048_000, modified: '11/19/26', time: '09:31:22', type: 'Database File' },
          { name: 'ONBOARD.EXE', size: 389_120, modified: '11/18/26', time: '16:40:59', type: 'Application' },
          { name: 'README.TXT', size: 4_096, modified: '11/16/26', time: '11:05:12', type: 'Text Document' }
        ]
      },
      {
        id: 'dos',
        label: 'DOS',
        path: 'C:\\DOS',
        files: [
          { name: 'COMMAND.COM', size: 54_619, modified: '3/10/92', time: '17:00:00', type: 'Application' },
          { name: 'FORMAT.COM', size: 32_911, modified: '3/10/92', time: '17:00:00', type: 'Application' },
          { name: 'EDIT.COM', size: 41_386, modified: '3/10/92', time: '17:00:00', type: 'Application' }
        ]
      }
    ]
  }
]

export function findDir(nodes: Array<FsDir>, id: string): FsDir | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const hit = node.children ? findDir(node.children, id) : null
    if (hit) return hit
  }
  return null
}

export function findDirByPath(nodes: Array<FsDir>, path: string): FsDir | null {
  const normalized = path.replace(/\\+$/, '')
  for (const node of nodes) {
    if (node.path.replace(/\\+$/, '') === normalized) return node
    const hit = node.children ? findDirByPath(node.children, path) : null
    if (hit) return hit
  }
  return null
}

export function parentPath(path: string): string | null {
  const trimmed = path.replace(/\\+$/, '')
  const index = trimmed.lastIndexOf('\\')
  if (index <= 0) return trimmed.length > 3 ? 'C:\\' : null
  return trimmed.slice(0, index)
}

export function formatSize(bytes: number): string {
  return `${bytes.toLocaleString('en-US')} bytes`
}
