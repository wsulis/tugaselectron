console.log('main process working');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const dialog = electron.dialog

let win;

function createWindow() {
    win = new BrowserWindow();
    
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    let contents = win.webContents
    console.log(contents)

    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null
    });
}

ipc.on('async-message', function(event, arg){
    event.sender.send('async-message-reply', 'Main process async message reply.');
})

ipc.on('sync-message', function(event, arg){
    event.returnValue = 'sync-reply';
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win == null) {
        createWindow();
    }
});
