'use strict';

const {app, BrowserWindow} = require('electron');

const path = require('path');
const url  = require('url');

let win;

function createWindow () {
	win = new BrowserWindow({
		width:     1024,
		height:    800,
		resizable: false,
		frame:     false,
		icon:      path.join(__dirname, 'images/favicon.ico')
	});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes:  true
	}));

	win.on('closed', () => {
		win = null
	});
}

app.commandLine.appendSwitch('--enable-smooth-scrolling');

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') return app.quit();
});

app.on('activate', () => {
	if (win === null) createWindow();
});