// Modules to control application life and create native browser window
const {app, BrowserWindow, protocol, Menu, ipcMain, Tray, nativeImage} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, contextMenu, tray, icon;
let loggedIn = false;
let testNetSelected = false;

const prodDebug = true;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
	  width: 1440,
	  height: 900,
	  minHeight: 570,
	  minWidth: 1280,
      webPreferences: {
	      devTools: prodDebug
      }
  });

  // Create tray item
  icon = nativeImage.createFromPath('./src/images/cacheIcon.png');
  contextMenu = Menu.buildFromTemplate([
      {label: 'Copy Address', enabled: false, click: function() {
          mainWindow.send('copyAddress');
          }}
  ]);
    tray = new Tray(icon);
    tray.setToolTip('Cache Wallet address');
    tray.setHighlightMode('never');
    tray.setContextMenu(contextMenu);

    //Create new enabled/disabled contextMenu based on login status
    ipcMain.on('loggedIn', function(e, arg) {
        contextMenu = null;
        loggedIn = arg;
        contextMenu = Menu.buildFromTemplate([
        {label: 'Copy Address', enabled: loggedIn, click: function() {
            mainWindow.send('copyAddress');}}
        ]);
        tray.setContextMenu(contextMenu);
    });

    //Get current address to copy in tray
    ipcMain.on('currentAddress', function(e, arg) {
        contextMenu = null;
        contextMenu = Menu.buildFromTemplate([
            {label: 'Copy Address ' + '(...' + arg + ')', enabled: loggedIn, click: function() {
                mainWindow.send('copyAddress');}}
        ]);
        tray.setContextMenu(contextMenu);
    });

	protocol.registerFileProtocol('atom', (request, callback) => {
		const url = request.url.substr(7)
		callback({path: path.normalize(`${__dirname}/${url}`)})
	}, (error) => {
		if (error) console.error('Failed to register protocol')
	})

  // and load the index.html of the app.
  mainWindow.loadFile('build/start.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

    var template = [{
        label: "CacheWallet",
        submenu: [
            { label: "About CacheWallet", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { type: "separator" },
            { label: "Toggle Developer Tools", accelerator: "Alt+CmdOrCtrl+I", click() { (prodDebug) ? mainWindow.toggleDevTools() : null }},
        ]}, {
        label: "Developer",
        submenu: [
            {label: "Use TestNet", type: 'checkbox', checked: testNetSelected, click: function() {mainWindow.webContents.send('testNet', !testNetSelected ? -104 : 104);}}
        ]}
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.on('networkSelected', (e, arg) => {
    testNetSelected = !testNetSelected;
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
