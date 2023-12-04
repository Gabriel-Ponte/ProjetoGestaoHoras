const os = require('os');
//const { app, BrowserWindow, dialog } = require('nw');
const fs = require('fs');
const path = require('path');



function findFolderByName(folderName, startPath = path.parse(process.cwd()).root) {
    const files = fs.readdirSync(startPath);

    for (const file of files) {
        const filePath = path.join(startPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file === folderName) {
                return filePath;
            } else if (!file.startsWith('$')) {
                const subfolderResult = findFolderByName(folderName, filePath);
                if (subfolderResult) {
                    return subfolderResult;
                }
            }
        }
    }

    return null;
}

const folderNameToFind = 'isqctag';
const folderPath = findFolderByName(folderNameToFind);

if (folderPath) {
    console.log(`Folder '${folderNameToFind}' found at: ${folderPath}`);
} else {
    console.log(`Folder '${folderNameToFind}' not found.`);
}

//let win;
// function createWindow() {
//   win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });

//   win.loadFile('index.html');

//   win.on('closed', () => {
//     win = null;
//   });

//   // You can call the openFileExplorer function when the window is ready
//   openFileExplorer();
// }

// function openFileExplorer() {
//   dialog.showOpenDialog(win, {
//     properties: ['openDirectory'],
//   }).then(result => {
//     if (!result.canceled && result.filePaths.length > 0) {
//       const selectedDirectory = result.filePaths[0];
//       console.log('Selected Directory:', selectedDirectory);

//       // Do something with the selected directory
//     }
//   }).catch(err => {
//     console.error(err);
//   });
// }

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (win === null) {
//     createWindow();
//   }
// });




// const os = require('os');

// // Get information about the disks
// const disks = os.platform() === 'win32' ? os.networkInterfaces() : os.homedir();
// const osInfo = navigator.appVersion;
// console.log('Operating System Information:', osInfo);
// console.log('Disks:', disks);

// const os = require('os');

// // Get information about the disks on the server side
// const platform = os.platform();

// if (platform === 'win32') {
//   // For Windows
//   const drives = os.cpus().map(cpu => cpu.times);
//   console.log('Active drives:', drives);
// } else if (platform === 'linux') {
//   // For Linux
//   const partitions = os.networkInterfaces(); // Example, you might need a different approach on Linux
//   console.log('Active partitions:', partitions);
// } else {
//   console.log('Unsupported operating system');
// }