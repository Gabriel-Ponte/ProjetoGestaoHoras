const mongoose = require('mongoose');
require('dotenv').config();
const ExcelJS = require('exceljs');
const { exec } = require('child_process');
const { exit } = require('process');


  let ret = false;
  // MongoDB connection settings
  const dbName = 'myproject'; // Replace with your database name
  const collectionProjetos = 'projetos'; // Replace with your collection name
  const collectionDias = 'dias';
  const collectionTipoTrabalhoHoras = 'tipotrabalhohoras';
  const collectionTipoTrabalho = 'tipotrabalhos';
  const collectionUtilizadores = 'utilizadores';
  // Excel file path and name
  const excelFilePath = process.env.EXTRACTION_FOLDER;

  // Excel template file path
  const templateFilePath = './TemplateHoras.xlsx';

  const exportExcell = async(req, res) =>{
    try {
      // Connect to MongoDB
      const url = process.env.MONGO_URI;
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      // Fetch data from MongoDB
      const collection = mongoose.connection.db.collection(collectionProjetos);
      const collectionU = mongoose.connection.db.collection(collectionUtilizadores);

      const collectionD = mongoose.connection.db.collection(collectionDias);
      const collectionTTH = mongoose.connection.db.collection(collectionTipoTrabalhoHoras);
      const collectionTT = mongoose.connection.db.collection(collectionTipoTrabalho);


      const data = await collection.find({}).toArray();
      const dataU = await collectionU.find({}).toArray();

      const dataD = await collectionD.find({}).toArray();
      const dataTT = await collectionTT.find({}).toArray();
      const dataTTH = await collectionTTH.find({}).toArray();


      let nomeUsers = []
      dataU.forEach((item, index) => {
        if (item.nome !== "Admin") {
          nomeUsers.push(item.nome);
        }
      })


      dataD.forEach((item, index) => {
        dataU.filter((user) => {
          if (user._id == item.Utilizador) {
            item.Utilizador = user.nome;
          }
        });

        data.filter((projeto) => {
          for (let i = 0; i < item?.tipoDeTrabalhoHoras?.length; i++) {
            if (projeto._id == item.tipoDeTrabalhoHoras[i].projeto) {
              item.tipoDeTrabalhoHoras[i].projeto = projeto.Nome;
            }
          }
        })



        for (let i = 0; i < item?.tipoDeTrabalhoHoras?.length; i++) {
          let arrayT = "";
          const ttID = item?.tipoDeTrabalhoHoras[i].tipoTrabalho.split(',');
          for (let j = 0; j < ttID.length; j++) {
            dataTT.filter((tipoDeTrabalho) => {
              if (tipoDeTrabalho._id == ttID[j]) {
                const tipoTrabalhoValue = tipoDeTrabalho?.TipoTrabalho;
                if (arrayT !== "") {
                  arrayT = arrayT + "," + tipoTrabalhoValue;
                } else {
                  arrayT = tipoTrabalhoValue;
                }
              }
            });
          }
          if (arrayT !== "") {
            item.tipoDeTrabalhoHoras[i].tipoTrabalho = arrayT;
          }
        }
      });



      // Define column headers and styling
      const headers = [
        '',
        '_id_P',
        'Cliente',
        'Nome',
        'DataInicio',
        'DataFim',
        'tipo',
        ...nomeUsers,
        'Total',
      ];

      const headersF = [
        '',
        'CODIGO',
        'CLIENTE',
        'PROJETOS',
        'INICIO',
        'FIM',
        'TIPO',
      ];
      const headersNames = [
        ...nomeUsers,
      ];

      const headersNamesT = [
        ...nomeUsers,
        'Total'
      ];
      // Load Excel template
      const workbook = new ExcelJS.Workbook();
      const workbookTemplate = new ExcelJS.Workbook();

      const dataWorksheet = new Date();


      await workbookTemplate.xlsx.readFile(templateFilePath);

      const monthNames = ["JAN", "FEB", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
      const monthNamesComplete = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

      for (let year = 2023; year <= dataWorksheet.getFullYear(); year++) {
        for (let month = 0; month <= dataWorksheet.getMonth(); month++) {
          let worksheet;
          const worksheetTemplate = workbookTemplate.getWorksheet();
          if (!worksheetTemplate) {
            console.error('Template worksheet not found.');
            return; // Exit the loop or handle the error as needed
          }
          worksheet = workbook.addWorksheet(monthNames[month]);
          worksheet.model = Object.assign({}, worksheetTemplate.model);
          worksheet.name = monthNames[month];


          // Copy the configuration (styles, formats, etc.) from the template to the new worksheet
          // Specify merged cell ranges manually
          const mergedCellRanges = [
            { from: { row: 1, col: 3 }, to: { row: 2, col: 7 } },
            { from: { row: 1, col: 8 }, to: { row: 2, col: 9 } },
            { from: { row: 3, col: 2 }, to: { row: 3, col: 7 } },
            { from: { row: 4, col: 2 }, to: { row: 4, col: 7 } },
            // Add more merged cell ranges as needed
          ];



          mergedCellRanges.forEach((range, index) => {
            worksheet.mergeCells(range.from.row, range.from.col, range.to.row, range.to.col);
            if (index === 0) {
              const monthName = monthNamesComplete[month];
              const cell = worksheet.getCell(range.from.row, range.from.col);
              cell.value = `${monthName} ${year}`;
              cell.font = { size: 22 };
            }
          });

          // Copy cell values and style from the template
          worksheetTemplate.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
              const isExcluded =
                rowNumber >= 1 &&
                rowNumber <= 2 &&
                colNumber >= 3 &&
                colNumber <= 7;
              if (!isExcluded) {
                const newCell = worksheet.getCell(rowNumber, colNumber);
                newCell.value = cell.value;
                newCell.style = Object.assign({}, cell.style); // Copy cell style
              }
            });
          });

          // Write header row

          // Write header row starting from column 8
          const startColumn = 1;
          worksheet.addRow([]);
          const headerRow = worksheet.getRow(1);
          headerRow.font = { bold: true };
          headerRow.alignment = { horizontal: 'center' };
          headers.forEach((header, index) => {
            worksheet.getCell(5, startColumn + index).value = header;
          });
          // Write data rows
          const startRow = 6;
          let rowCount = 0;



          const arrayTT = [];
          data.forEach((item, index) => {

            if (!item.Finalizado || (item.DataFim && item.DataFim.getMonth() >= month) && (item.DataInicio && item.DataInicio.getMonth() <= month)) {
              arrayTT[index] = [];

              let row = worksheet.getRow(startRow + rowCount);

              headers.forEach((header, columnIndex) => {
                let value = item[header] || '';

                // Modify the values based on the header
                if (['DataInicio', 'DataFim'].includes(header)) {
                  value = new Date(value).toLocaleDateString();
                  if (value === "Invalid Date") {
                    value = ''
                  }
                }
                if(columnIndex <6){
                row.getCell(columnIndex + 1).value = value;
              }
                // Consider adding comments for context and explanations
                let count = rowCount;
                if (['tipo'].includes(header)) {
                  dataD.forEach((itemDay, indexDay) => {
                    if (itemDay?.Data?.getMonth() === month && itemDay?.Data?.getFullYear() === year) {
                      for (let i = 0; i < itemDay?.tipoDeTrabalhoHoras?.length; i++) {
                        if (itemDay?.tipoDeTrabalhoHoras[i]?.projeto === item?.Nome && itemDay?.Utilizador !== "Admin") {
                          const tipoT = itemDay?.tipoDeTrabalhoHoras[i]?.tipoTrabalho.split(",");
                          const splitHoras = itemDay?.tipoDeTrabalhoHoras[i]?.horas.split(",");

                          for (let t = 0; t < tipoT.length; t++) {
                            if (splitHoras[t] !== "0" && splitHoras[t] !== 0) {
                              if (!arrayTT[index].some(item => item.value === tipoT[t])) {
                                if ((Array.isArray(arrayTT[index])   && arrayTT[index].length > 0) && (tipoT.length === 1 || t!== 0 & (t !== tipoT.length - 1))) {
                                  rowCount++;
                                  count = rowCount;
                                  columnIndex++;
                                  }

                                arrayTT[index].push({ value: tipoT[t], rowCount: rowCount });
                              } else {
                               
                                const existingItem = arrayTT[index].find(item => item.value === tipoT[t]);
                                
                                if (existingItem) {
                                  count = existingItem.rowCount;
                                }
                              }

                              row = worksheet.getRow(startRow + count);
                              setCellValue(row, '_id_P', item._id_P);
                              setCellValue(row, 'Cliente', item.Cliente);
                              setCellValue(row, 'Nome', item.Nome);
                              setCellValue(row, 'DataInicio', formatDateString(item.DataInicio));
                              setCellValue(row, 'DataFim', formatDateString(item.DataFim));
                              setCellValue(row, 'tipo', tipoT[t]);
                              updateCellUser(row, headers, itemDay, tipoT[t], splitHoras[t]);

                            }
                          }
                        }
                      }
                    }
                  });
                }
              });
              rowCount++;
            }


          });

            // Example functions
            function setCellValue(row, columnName, value) {
              const cellIndex = headers.indexOf(columnName) + 1;
              const cell = row.getCell(cellIndex);
              cell.value = value;
            }

            function formatDateString(dateString) {
              const date = new Date(dateString).toLocaleDateString(); 
              // Add logic to format date strings as needed
              if (date === "01/01/1970") {
                return '';
              }
              return date;
            }

            function updateCellUser(row, headers, itemDay, tipo, horas) {
              const cellIndex = headers.indexOf(itemDay?.Utilizador) + 1;
              const cellUser = row.getCell(cellIndex);
              if (cellUser.value === null) {
                cellUser.value = Number(horas);
                return;
              }
              cellUser.value = Number(cellUser.value) + Number(horas);
              return;
            }

          headersNamesT.forEach((header, index) => {
            const indexA = 8 + index;
            const letter = getExcelColumnLetter(indexA - 1);
            worksheet.getCell(rowCount + 6, indexA).value = { formula: `=SUM(${letter}${6}: ${letter}${rowCount + 5})` };
          });

          headersNames.forEach((header, index) => {
            const indexA = 8 + index;
            const letter = getExcelColumnLetter(indexA - 1);
            worksheet.getCell(3, indexA).value = { formula: `=SUM(${letter}${6}: ${letter}${rowCount + 5})/($B$2*8)` };
          });

          headersNames.forEach((header, index) => {
            const indexA = 8 + index;
            const letter = getExcelColumnLetter(indexA - 1);
            worksheet.getCell(4, indexA).value = { formula: `=+$B$2*8-SUM(${letter}${6}: ${letter}${rowCount + 5})` };
          });

          headersNamesT.forEach((header, index) => {
            const indexA = 8 + index;
            if (['Total'].includes(header)) {
              const letter = getExcelColumnLetter(indexA - 2);
              const letterS = getExcelColumnLetter(7);
              worksheet.getCell(2, indexA).value = 'Total:';
              worksheet.getCell(3, indexA).value = { formula: `=SUM(${letterS}${3}: ${letter}${3})/COUNT(${letterS}3:${letter}3)` };
              worksheet.getCell(4, indexA).value = { formula: `=SUM(${letterS}${4}: ${letter}${4})` };;
              "=SOMA(H3:S3)/CONTAR(H3:S3)"
            }
          });


          for (i= startRow; i <rowCount +startRow; i++){
            let row = worksheet.getRow(i);
            const cellT = row.getCell(headers.indexOf('Total') + 1);
            const letter = getExcelColumnLetter(headers.length - 2);
            // cellT.fill = {
            //   type: 'pattern',
            //   pattern: 'solid',
            //   fgColor: { argb: 'F2F2F2' }
            // };
            // cellT.border = {
            //   top: { style: 'thin' },
            //   left: { style: 'thin' },
            //   bottom: { style: 'thin' },
            //   right: { style: 'thin' },
            // };
            cellT.value = { formula: `=SUM(H${i}:${letter}${i})` };
        }
          headersF.forEach((header, index) => {
            worksheet.getCell(5, index + 1).value = header;
          });
          // Auto-fit columns
          worksheet.columns.forEach((column, columnIndex) => {
            if (column && column.header) {
              column.width = column.header.length < 10 ? 10 : column.header.length;
            }
          });
        }
      }

      // Function to convert a numerical index to a corresponding Excel column letter
      function getExcelColumnLetter(index) {
        let letter = "";
        while (index >= 0) {
          letter = String.fromCharCode(65 + (index % 26)) + letter;
          index = Math.floor(index / 26) - 1;
        }
        return letter;
      }

      // Save the workbook
      await workbook.xlsx.writeFile(excelFilePath)
        .then(() => {
          ret = true;
        })
        .catch((error) => {
          ret = false;
        });

    } catch (error) {
      ret = false;
    }
    return ret;
  }

module.exports = {
  exportExcell,
};
