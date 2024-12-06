// Electron's main and renderer process have distinct responsibilities and are not interchangeable. 
// This means it is not possible to access the Node.js APIs directly from the renderer process, 
// nor the HTML Document Object Model (DOM) from the main process.

// The solution for this problem is to use Electron's ipcMain and ipcRenderer modules for inter-process communication (IPC). 
// To send a message from your web page to the main process, you can set up a main process handler with ipcMain.handle and then 
// expose a function that calls ipcRenderer.invoke to trigger the handler in your preload script.

// Notice how we wrap the ipcRenderer.invoke('ping') call in a helper function rather than expose the ipcRenderer module directly 
// via context bridge. You never want to directly expose the entire ipcRenderer module via preload. 
// This would give your renderer the ability to send arbitrary IPC messages to the main process, which becomes a powerful attack 
// vector for malicious code.

// A preload script contains code that runs before your web page is loaded into the browser window. It has access to both DOM 
// APIs and Node.js environment, and is often used to expose privileged APIs to the renderer via the contextBridge API.

// Because the main and renderer processes have very different responsibilities, Electron apps often use the preload script to 
// set up inter-process communication (IPC) interfaces to pass arbitrary messages between the two kinds of processes.

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})