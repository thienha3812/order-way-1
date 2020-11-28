import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow,ipcMain ,screen,Menu} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
const Store = require('electron-store')
const store =new Store()


export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let workerWindow : BrowserWindow | null = null; 
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize  
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    center:true,
    minHeight: height * 0.9,
    minWidth: width * 0.8,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration:true,
    },
      
  });  
  // mainWindow.setMaximumSize(0.8 * width,0.8 * height)
  mainWindow.loadURL(`file://${__dirname}/app.html`);  
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      // mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.on('resize',()=>{
    mainWindow.center()
  })

  /// Worker Window
  workerWindow = new BrowserWindow({
    show:false,
    webPreferences:{
      nodeIntegration:true,
      preload: path.join(__dirname,"preload.js")
    }
  })
  workerWindow.loadURL(`file://${__dirname}/worker.html`);  
  // workerWindow.hide()
  workerWindow.webContents.openDevTools()
  workerWindow.on("closed",()=>{
    workerWindow = null
  })
  ipcMain.on("print",(event,content)=>{
    workerWindow.webContents.send("print",content)
  })
  ipcMain.on("readyToPrint",(event,content)=>{
    try{
      let win = BrowserWindow.getFocusedWindow() 
      const printers  = win?.webContents.getPrinters()
      const printersName = printers.map(p => p.name)      
      if(content.type == "printKitchenBill"){
        const kitchenBill = store.get("kitchenBill")        
        const namePrinter = kitchenBill.name
        if(!printersName.includes(name)){
            return
        }
        workerWindow.webContents.print({deviceName:namePrinter,printBackground:true,margins:{marginType:'custom',top:20,bottom:20,left:0,right:0},silent:true},(success,err)=>{
        })
      }
      if(content.type == "printOrderBill"){
        const orderBill = store.get("orderBill")
        const namePrinter = orderBill.name
        if(!printersName.includes(name)){
          return
        }
        workerWindow.webContents.print({deviceName:namePrinter,printBackground:true,margins:{marginType:'custom',top:20,bottom:20,left:0,right:0},silent:true},(success,err)=>{
        })
      }
    }catch(err){

    }
  })
  Menu.setApplicationMenu(null)
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on('ready', createWindow);
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
