/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import electronDl, { download } from 'electron-dl';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

// AutoUpdater Configurations
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdates();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    show: false,
    width: width * 0.9,
    height: height * 0.9,
    minWidth: width * 0.9,
    minHeight: height * 0.9,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,

    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // Download Sample Product File
  ipcMain.on('download', async (event, { file }) => {
    const win: any = BrowserWindow.getFocusedWindow();
    try {
      console.log('wind', win);
      console.log(
        await download(win, file, {
          openFolderWhenDone: true,
          directory: path.join(app.getPath('downloads'), '/POS'),
        }),
      );
    } catch (error) {
      if (error instanceof electronDl.CancelError) {
        console.info('item.cancel() was called');
      } else {
        console.error(error);
      }
    }
  });

  ipcMain.handle('check-for-updates', async () => {
    console.log('checking for updates');
    console.log('=============', app.getVersion());

    console.log('process', process.platform);
    // if (process.platform !== 'darwin') {
    //   const data = {
    //     error: true,
    //     message: 'AutoUpdate feature is only for windows',
    //   };

    //   // return data;
    // }
    // eslint-disable-next-line no-new
    new AppUpdater();
    return true;
  });

  ipcMain.handle('get-app-version', async () => {
    console.log('checking for updates', app.getVersion());
    // console.log('process', process.platform);
    // if (process.platform !== 'darwin') {
    //   const data = {
    //     error: true,
    //     message: 'AutoUpdate feature is only for windows',
    //   };

    //   // return data;
    // }
    // eslint-disable-next-line no-new
    // new AppUpdater();
    return app.getVersion();
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // function showUpdatePrompt(message) {
  //   console.log('show mesage trapped');
  //   console.log(message);
  // }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

autoUpdater.on('update-available', () => {
  const path = autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', () => {
  console.log('no update is available');
});

autoUpdater.on('update-downloaded', () => {
  console.log('update is downloaded');
});

autoUpdater.on('error', (err) => {
  console.log('auto update has an error', err);
});
