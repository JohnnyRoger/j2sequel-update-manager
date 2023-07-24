// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

let mainWindow;
let preferencesWindow;
let tray;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false, // We'll show the window later when ready
        skipTaskbar: true, // Hide the app from the taskbar/dock
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    // Add a listener for the close event of the main window
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault(); // Prevent the default close behavior
            mainWindow.hide(); // Hide the window instead
        }
    })

    // Create the system tray
    tray = new Tray(path.join(__dirname, '/icon.png'));
    // Set the tooltip title for the tray icon
    tray.setToolTip('J2Sequel Manager');
    // Add a click event handler to show/hide the window when the tray icon is clicked
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });

    // Create a context menu for the system tray
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open App', click: () => mainWindow.show() },
        { label: 'Preferences...', click: openPreferencesWindow },
        { label: 'Quit', click: () => app.quit() }
    ]);

    // Set the context menu for the system tray
    tray.setContextMenu(contextMenu);

})

app.on('before-quit', () => {
    app.isQuitting = true; // Set a flag to indicate app is quitting
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function openPreferencesWindow() {
  // Create the secondary window
  preferencesWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  preferencesWindow.removeMenu()

  // Load your HTML file or entry point for the secondary window
  preferencesWindow.loadFile('preferences.html');
}
