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
//const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2, range: 2, raw: false }); // Remove the first two columns (column A and B) from each row

const jsonData = XLSX.utils.sheet_to_json(worksheet, 
    { header: ['Empty','_id_P', 'Cliente', 'Nome', 'Acao', 'DataInicio', 'DataObjetivo', 'AlertaDias', 'Piloto', 'Notas', 'Finalizado', 'Resultado', 'Links', 'TipoTrabalho', 'OrçamentoAprovado']
    , range: 3, raw: false });

//Remove Row AlertaDias
for(let i = 0 ; i< jsonData.length ; i++){
  delete jsonData[i].AlertaDias;
  jsonData[i].TipoTrabalho = "Estudos,Orçamento,Trabalhos CTAG,Instalações";
  jsonData[i].Tema = jsonData[i].Cliente;
  if (jsonData[i].Finalizado) {
    jsonData[i].Finalizado = true
  }else{
    jsonData[i].Finalizado = false
  }
  if (jsonData[i].Resultado && jsonData[i].Resultado.toLowerCase() === "ok") {
    jsonData[i].Resultado = true
}else{
    jsonData[i].Resultado= false
}
}

// Write JSON data to a file
fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
  if (err) {
    console.error('Error writing JSON file:', err);
  } else {
    console.log('JSON file created successfully.');
  }
});


