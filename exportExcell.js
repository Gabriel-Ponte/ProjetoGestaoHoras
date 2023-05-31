const XLSX = require('xlsx');
//const Docxtemplater = require('docxtemplater');
const fs = require('fs');
//const async = require('async');
//const iconv = require('iconv-lite');

// Load the Excel file
const workbook = XLSX.readFile('Seguimento_ações_2023.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert Excel data to JSON
//const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 2 });
// Convert Excel data to JSON, ignoring the first column
const jsonData = XLSX.utils.sheet_to_json(worksheet, 
    { header: ['Empty','Codigo', 'Tema', 'Nome', 'Acao', 'DataInicio', 'DataObjetivo', 'AlertaDias', 'Piloto', 'Notas', 'Finalizado', 'Resultado', 'Links', 'TipoTrabalho', 'OrçamentoAprovado']
    , range: 3, raw: false });

//const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2, range: 2, raw: false }); // Remove the first two columns (column A and B) from each row
console.log(jsonData[0].Codigo)
// Write JSON data to a file
fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
  if (err) {
    console.error('Error writing JSON file:', err);
  } else {
    console.log('JSON file created successfully.');
  }
});


