const mongoose = require('mongoose');
require('dotenv').config();
const ExcelJS = require('exceljs');

  const updateExcell = async () => {
    let ret = false;

  try {
  // MongoDB connection settings
  const dbName = 'myproject'; // Replace with your database name
  const collectionName = 'projetos'; // Replace with your collection name
  const collectionUtilizadores = 'utilizadores';
  // Excel file path and name
  const excelFilePath = process.env.EXCEL_EXPORT;

  // Excel template file path
  const templateFilePath = './Template.xlsx';





      // Connect to MongoDB
      const url = process.env.MONGO_URI;
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

      // Fetch data from MongoDB
      const collection = mongoose.connection.db.collection(collectionName);
      const collectionU = mongoose.connection.db.collection(collectionUtilizadores);

      const data = await collection.find({}).toArray();
      const dataU = await collectionU.find({}).toArray();

      // Load Excel template
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templateFilePath);

      // Select the desired worksheet (assuming it's the first one)
      const worksheet = workbook.worksheets[0];

      // Define column headers and styling
      const headers = [
        'Empty',
        '_id_P',
        'Cliente',
        'Nome',
        'Acao',
        'DataInicio',
        'DataObjetivo',
        'AlertaDias',
        'Piloto',
        'Notas',
        'Finalizado',
        'Resultado',
        'Links',
        'TipoTrabalho',
        'OrçamentoAprovado',
        'TipoTrabalho'
      ];



      // Write header row
      worksheet.addRow(headers);
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };

      // Write data rows
      const startRow = 4;
      data.forEach((item, index) => {
        const row = worksheet.getRow(startRow + index);

      const PilotosList = Array.isArray(item.Piloto)
        ? item.Piloto.length > 0
          ? item.Piloto[0].split(/[,/]/)
          : []
        : item.Piloto.split(/[,/]/);
      

      const listUpdated = [...PilotosList];
      if(PilotosList && PilotosList.length >0){
      for (let a = 0; a < PilotosList.length; a++) {
        for (let i = 0; i < dataU.length; i++) {
      
          if (PilotosList[a] == dataU[i]._id) {

            PilotosList[a] = dataU[i].nome;
            break;
          } else if (PilotosList[a] === dataU[i].login && dataU[i].login.length < 4) {
            PilotosList[a] = dataU[i].nome;
            listUpdated[a] = dataU[i]._id;
            break;
          }
        }
      }
    }


        headers.forEach((header, columnIndex) => {
          let value = item[header] || '';
          // Modify the values based on the header
          if (header === 'Piloto') {
            value = PilotosList.map((part, index) => (
              index === 0 ? part : `, ${part}`
            )).join('');
            if (value.startsWith(',')) {
              value = value.substring(2);
            }

          }
          if (header === 'Finalizado') {
            if (value === true) {
              value = 'ok';
            }
          }
          if (header === 'Resultado') {
            if (value === true) {
              value = 'ok';
            } else if (value === false) {
              value = 'ko';
            }
          }
          if (['DataInicio', 'DataObjetivo', 'DataFinal'].includes(header)) {
            value = new Date(value).toLocaleDateString();
          }
          if (['TipoTrabalho', 'OrçamentoAprovado'].includes(header)) {
            value = '';
          }
          row.getCell(columnIndex + 1).value = value;
        });
        if (item['Finalizado'] === false) {
          const cell = row.getCell(headers.indexOf('AlertaDias') + 1);
          cell.value = { formula: `=(G${startRow + index}-$K$2)` };
        }
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        if (column && column.header) {
          column.width = column.header.length < 12 ? 12 : column.header.length;
        }
      });

    // Save the workbook
    await workbook.xlsx.writeFile(excelFilePath)
      .then(() => {
        ret = true;
      })
      .catch((error) => {
        ret = false;
      });

  } catch (error) {
    console.error("Error Export Horas", error);
    ret = false;
  }

  return ret;
}

module.exports = {
  updateExcell
};