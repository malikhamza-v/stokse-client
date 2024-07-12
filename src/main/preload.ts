// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'update-download-status';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: string, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

// const bridge = {
//   updateMessage: (callback) => ipcRenderer.on('updateMessage', callback),
// };

contextBridge.exposeInMainWorld('electron', electronHandler);
// contextBridge.exposeInMainWorld('bridge', bridge);
// contextBridge.exposeInMainWorld('ipcRenderer', {
//   send: (channel: any, data: any) => ipcRenderer.send(channel, data),
//   on: (channel: any, func: any) =>
//     ipcRenderer.on(channel, (event, ...args) => func(...args)),
//   invoke: (channel: any, ...args: any[]) => {
//     return ipcRenderer.invoke(channel, ...args);
//   },
// });

export type ElectronHandler = typeof electronHandler;
