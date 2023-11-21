import React, { useEffect, useState } from 'react';
// import nw from 'nw';
// import { dialog } from 'nw';

const ProjetoListaFolder = () => {
  // const [win, setWin] = useState(null);
  //   const useDialog = dialog();
  //   const useNw = nw()
  // useEffect(() => {
  //   createWindow();

  //   return () => {
  //     if (win) {
  //       win.close(true);
  //     }
  //   };
  // }, []);

  // function createWindow() {
  //   const BrowserWindow = useNw.Window;
  //   const newWin = new BrowserWindow({
  //     width: 800,
  //     height: 600,
  //     webPreferences: {
  //       nodeIntegration: true,
  //     },
  //   });

  //   newWin.on('closed', () => {
  //     setWin(null);
  //   });

  //   setWin(newWin);
  //   newWin.loadFile('index.html');
  // }

  // function openFileExplorer() {
  //   if (win) {
  //       useDialog
  //       .showOpenDialog(win, {
  //         properties: ['openDirectory'],
  //       })
  //       .then((result) => {
  //         if (!result.canceled && result.filePaths.length > 0) {
  //           const selectedDirectory = result.filePaths[0];
  //           console.log('Selected Directory:', selectedDirectory);
  //           // Do something with the selected directory
  //         }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }

  // function handleDirectoryChange(event) {
  //   const selectedDirectory = event.target.files[0]?.webkitRelativePath;
  //   console.log('Selected Directory:', selectedDirectory);

  //   // Get the selected files
  //   const selectedFiles = event.target.files;
  //   console.log('Selected Files:', selectedFiles);
  // }

  return (
    <div className='row text-center'>
      <button
        type='button'
        className='btn btn-outline-secondary buttonProjeto'
        // onClick={() => openFileExplorer()}
      >
        Visualizar
      </button>

      <label htmlFor='fileInput' className='btn btn-outline-success buttonProjeto'>
        Adicionar Path
        <input
          type='file'
          id='fileInput'
          webkitdirectory='true'
          directory='true'
          style={{ display: 'none' }}
          // onChange={(event) => handleDirectoryChange(event)}
        />
      </label>
    </div>
  );
};

export default ProjetoListaFolder;
