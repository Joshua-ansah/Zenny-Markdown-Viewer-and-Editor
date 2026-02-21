// IPC Channel names - shared between main and renderer
export const IPC_CHANNELS = {
  // File operations
  FILE_OPEN: 'file:open',
  FILE_SAVE: 'file:save',
  FILE_SAVE_AS: 'file:saveAs',
  FILE_GET_RECENT: 'file:getRecent',
  FILE_CLEAR_RECENT: 'file:clearRecent',
  FILE_OPEN_RECENT: 'file:openRecent',

  // PDF export
  PDF_EXPORT: 'pdf:export',
  PDF_EXPORT_DIALOG: 'pdf:exportDialog',

  // App operations
  APP_GET_PATH: 'app:getPath',
  APP_SET_TITLE: 'app:setTitle',
  APP_OPEN_EXTERNAL: 'app:openExternal',
  APP_RESOLVE_PATH: 'app:resolvePath',
  APP_READ_DIRECTORY: 'app:readDirectory',

  // Menu events (main -> renderer)
  MENU_TOGGLE_VIEW: 'menu:toggleView',
  MENU_NEW_FILE: 'menu:newFile',
  MENU_EXPORT_PDF: 'menu:exportPDF',
} as const;

export type IPCChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
