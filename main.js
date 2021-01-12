const { app, BrowserWindow, ipcMain, Tray, Menu, application, globalShortcut, screen } = require('electron');

let mainWindow = null;
app.on('ready', () => {

  let mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    x: getMousePosition().x,
    y: getMousePosition().y - 50,
    webPreferences: {
      nodeIntegration: true
    },
  });

  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.removeMenu();

  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  globalShortcut.register("Shift+Control+c", () => { showMainWindow(mainWindow); });
  globalShortcut.register("Shift+Control+x", () => { mainWindow.hide(); });
  globalShortcut.register("Esc", () => { mainWindow.hide(); });

  tray = criarTrayMenu(mainWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function criarTrayMenu(mainWindow){
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir App', click: function () {
        showMainWindow(mainWindow);
      }
    },
    {
      label: 'Sair', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray = new Tray('icon.png');
  tray.setContextMenu(contextMenu);
  return tray;
}

function getMousePosition(){
  return screen.getCursorScreenPoint();
}

function showMainWindow(mainWindow){
  mainWindow.setPosition(getMousePosition().x, getMousePosition().y);
  mainWindow.show();
}
