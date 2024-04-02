// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const express = require('express');
const path = require('node:path')
//const ffmpegPath  = require('ffmpeg-static');
//Stream            = require('node-rtsp-stream');

let msgqueue = []
let server = express();


server.get('/message', function(req, res) {
  const user = req.query.user;
  const msg = req.query.msg;
  const obj = {
      'user' : user,
      'msg' : msg
  };
  msgqueue.push(obj);
  res.send({
      'user' : user,
      'msg' : msg
  });
});

server.get('/message/read', function(req,res) {
  if(msgqueue.length > 0 ) {
      const element = msgqueue.shift();
      res.send(element);
  }else {
      res.send({});
  }
});

server.listen(3000);

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.removeMenu();  //Quitar para debug

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
