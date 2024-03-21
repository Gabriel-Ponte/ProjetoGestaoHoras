const mongoose = require('mongoose');
require('dotenv').config();
const ExcelJS = require('exceljs');


const useFeriadosPortugal = (date) => {
  const feriados = getHolidaysForYear(date.getFullYear());

  for (const feriado of feriados) {
    if (
      date.getDate() === feriado.date.getDate() &&
      date.getMonth() === feriado.date.getMonth() &&
      date.getFullYear() === feriado.date.getFullYear()
    ) {
      return true;
    }
  }
  return false;
};


const holidayCache = {};

const getHolidaysForYear = (year) => {
  if (holidayCache[year]) {
    return holidayCache[year];
  }

  const holidays = [];

  for (let i = year - 5; i < year + 5; i++) {
    holidays.push(
      { name: "Ano Novo", date: new Date(i, 0, 1) },
      { name: "Dia da Liberdade", date: new Date(i, 3, 25) },
      { name: "Dia do Trabalhador", date: new Date(i, 4, 1) },
      { name: "Dia de Portugal", date: new Date(i, 5, 10) },
      { name: "Assunção de Nossa Senhora", date: new Date(i, 7, 15) },
      { name: "Ferias Coletivas", date: new Date(2024, 7, 16) },
      { name: "Implantação da República", date: new Date(i, 9, 5) },
      { name: "Dia de Todos os Santos", date: new Date(i, 10, 1) },
      { name: "Restauração da Independência", date: new Date(i, 11, 1) },
      { name: "Dia da Imaculada Conceição", date: new Date(i, 11, 8) },
      { name: "Feriado Municipal", date: new Date(i, 2, 12) },
      { name: "Ferias Coletivas", date: new Date(i, 11, 24) },
      { name: "Natal", date: new Date(i, 11, 25) },
      { name: "Ferias Coletivas", date: new Date(i, 11, 26) },
      { name: "Carnaval", date: calculateEaster(i, "Carnaval") },
      { name: "Sexta-feira Santa", date: calculateEaster(i, "SextaFeiraSanta") },
      { name: "Páscoa", date: calculateEaster(i, "DomingoPascoa") },
      { name: "Segunda-feira de Páscoa", date: new Date(2023, 3, 10) }, //{ name: "Segunda-feira de Páscoa", date: calculateEaster(i, "SegundaPascoa") },
      { name: "Corpo de Deus", date: calculateCorpusChristi(i) },
    );
  }

  holidayCache[year] = holidays;
  return holidays;
};

function calculateEaster(year, type) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  if (type === "SextaFeiraSanta") {
    return new Date(year, month, day - 2);
  } else if (type === "DomingoPascoa") {
    return new Date(year, month, day);
  } else if (type === "SegundaPascoa") {
    return new Date(year, month, day + 1);
  } else if (type === "Carnaval") {
    return new Date(year, month, day - 47);
  }
}

function calculateCorpusChristi(ano) {
  const domingoPascoa = calculateEaster(ano, "DomingoPascoa");
  return new Date(ano, domingoPascoa.getMonth(), domingoPascoa.getDate() + 60);
}

function getPossibleDaysCount(month, year) {
  try{
  const daysInMonth = new Date(year, month + 1, 0).getDate(); 
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); 
    const isHoliday = useFeriadosPortugal(date); 
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
        count += 1;
    }
  }
  return count;
}catch(error){
  console.error(error)
}
}

function getPossibleHoursCount(month, year) {
  try{
  const daysInMonth = new Date(year, month + 1, 0).getDate(); 
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); 
    const isHoliday = useFeriadosPortugal(date); 
    const today = new Date();
    if (date >= today) {
      break;
    }
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
      if (dayOfWeek === 5) {
        count += 6;
      } else {
        count += 8.5;
      }
    }
  }
  return count;
}catch(error){
  console.error(error)
}
}

let ret = false;
// MongoDB connection settings
//const dbName = 'myproject'; // Replace with your database name
const collectionProjetos = 'projetos'; // Replace with your collection name
const collectionDias = 'dias';
const collectionTipoTrabalhoHoras = 'tipotrabalhohoras';
const collectionTipoTrabalho = 'tipotrabalhos';
const collectionUtilizadores = 'utilizadores';

// Excel file path and name
let excelFilePath = process.env.EXTRACTION_FOLDER_PROJETOS;

// Excel template file path
const templateFilePath = './TemplateHorasProjetos.xlsx';

const exportExcellHoursProjetos = async () => {

  try {
    // Connect to MongoDB
    const url = process.env.MONGO_URI;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    // Fetch data from MongoDB
    const collection = mongoose.connection.db.collection(collectionProjetos);
    const collectionD = mongoose.connection.db.collection(collectionDias);
    const collectionTTH = mongoose.connection.db.collection(collectionTipoTrabalhoHoras);
    const collectionTT = mongoose.connection.db.collection(collectionTipoTrabalho);
    const collectionU = mongoose.connection.db.collection(collectionUtilizadores);

    const data = await collection.find({}).toArray();
    const dataU = await collectionU.find({}).toArray();

    const dataD = await collectionD.find({}).toArray();
    const dataTT = await collectionTT.find({}).toArray();
    const dataTTH = await collectionTTH.find({}).toArray();

      // SORT NAO REALIZADOS PARA O FIM ???

    data.sort((a, b) => { 
      // First, sort by DataInicio
      if (a.DataInicio < b.DataInicio) {
        return -1;
      } else if (a.DataInicio > b.DataInicio) {
        return 1;
      }
      // If both DataInicio and Finalizado are equal, no change
      return 0;
    });

    data.sort((a, b) => {
      // Sort by Finalizado
      const finalizadoComparison = a.Finalizado - b.Finalizado;
  
      if (finalizadoComparison !== 0) {
          return finalizadoComparison;
      }
  
      // If Finalizado is equal, sort by Resultado
      return 0
  });


    
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
        }  //TESTAR PARA RETIRAR IDS REMOVIDOS
        else if(i === item?.tipoDeTrabalhoHoras?.length -1 ){
          item.tipoDeTrabalhoHoras[i].tipoTrabalho = "Outro";
        }
      }
    });

    const filteredEnded = [...data.filter(item => item.Finalizado === true)];
    // Load Excel template
    const workbook = new ExcelJS.Workbook();
    const workbookTemplate = new ExcelJS.Workbook();


    const dataWorksheet = new Date();
    const dateStart = new Date(2023, 5);

    await workbookTemplate.xlsx.readFile(templateFilePath);


    const monthNames = ["JAN", "FEB", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const monthNamesComplete = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

  
    let months = []
    for (let year = 2023; year <= dataWorksheet.getFullYear(); year++) {
      let monthCheck = dataWorksheet.getMonth();
      
      let month = 0

      if (year === dateStart.getFullYear()) {
        month = dateStart.getMonth();
      }
      if (year < dataWorksheet.getFullYear()) {
        monthCheck = 11;
      } else {
        monthCheck = dataWorksheet.getMonth()
      }


      for (month; month <= monthCheck; month++) {
        const mName = monthNames[month];
        const value = mName+" "+year 
        months.push(value)
      }
    }

    let nomeUsers = []
    dataU.forEach((item, index) => {
      if (item.nome !== "Admin" && (Number(item?.tipo) === 1 || Number(item?.tipo) === 2 || Number(item?.tipo) === 5)) {
        nomeUsers.push(item.nome);
      }
    })

    // Define column headers and styling
    const headers = [
      '',
      '_id_P',
      'Cliente',
      'Nome',
      'DataInicio',
      'DataFim',
      'tipo',
      ...months,
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

    const headersT = [
      ...months,
      'Total'
    ];

    
    dataU.sort((a, b) => a.tipo - b.tipo);




   // Define column headers and styling
   const headersPessoas = [
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

 
    const projetoGeral = (data.filter(item => item.Nome === "Geral"));

    if (projetoGeral.length > 0) {
      projetoGeral[0].Cliente = "Interno";
    }

    const reorderedData = [...projetoGeral, ...data.filter(item => item.Nome !== "Geral")];
    
        let worksheet;
        const worksheetTemplate = workbookTemplate.getWorksheet();
        if (!worksheetTemplate) {
          console.error('Template worksheet not found.');
          return; // Exit the loop or handle the error as needed
        }

        const worksheetName = "Projetos";

        worksheet = workbook.addWorksheet(worksheetName);
        worksheet.model = Object.assign({}, worksheetTemplate.model);
        worksheet.name = worksheetName;

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
            const month = dataWorksheet.getMonth()
            const year = dataWorksheet.getFullYear()
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
        reorderedData?.forEach((item, index) => {

            arrayTT[index] = [];

            let row = worksheet?.getRow(startRow + rowCount);

            headers?.forEach((header, columnIndex) => {
              let value = item[header] || '';
    
              // Modify the values based on the header
              if (['DataInicio', 'DataFim'].includes(header)) {
                value = new Date(value)?.toLocaleDateString();
                if (value === "Invalid Date") {
                  value = ''
                }
              }
              if (columnIndex < 6) {
                row.getCell(columnIndex + 1).value = value;
              }
              // Consider adding comments for context and explanations
              let count = rowCount;
              let countStart = startRow + rowCount;
              if (['tipo'].includes(header)) {
                dataD?.forEach((itemDay, indexDay) => {

                    for (let i = 0; i < itemDay?.tipoDeTrabalhoHoras?.length; i++) {
                      if (itemDay?.tipoDeTrabalhoHoras[i]?.projeto === item?.Nome) {

                        const tipoT = itemDay?.tipoDeTrabalhoHoras[i]?.tipoTrabalho.split(",");
                        const splitHoras = itemDay?.tipoDeTrabalhoHoras[i]?.horas.split(",");

                        for (let t = 0; t < tipoT.length; t++) {
                          
                          if (splitHoras[t] !== "0" && splitHoras[t] !== 0) {
                            if (!arrayTT[index].some(item => item.value === tipoT[t])) {
                              
                              if ((Array.isArray(arrayTT[index]) && arrayTT[index].length > 0)) {
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
                            updateCellProjetos(row, headers, itemDay, tipoT[t], splitHoras[t]);
                          }
                        }
                      }
                    }
                  
                });
                
                row = worksheet.getRow(startRow + rowCount);
                const countEnd = startRow + rowCount

                setCellValue(row, '_id_P', item._id_P);
                setCellValue(row, 'Cliente', item.Cliente);
                setCellValue(row, 'Nome', item.Nome);
                setCellValue(row, 'DataInicio', formatDateString(item.DataInicio));
                setCellValue(row, 'DataFim', formatDateString(item.DataFim));
                setCellValue(row, 'tipo', 'Total');
                updateCellTotal(row, headers, countStart, countEnd);
              }
            });
            rowCount++;
        });

        function setCellValueColor(row, columnName, value) {

          const cellIndex = headers.indexOf(columnName) + 1;
          const cell = row.getCell(cellIndex);
          cell.value = value;

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '50623A' } // Set the desired background color code
          };
          return;
        }

        function formatDateString(dateString) {
          const date = new Date(dateString).toLocaleDateString();
          // Add logic to format date strings as needed
          if (date === "01/01/1970") {
            return '';
          }
          return date;
        }


        function updateCellProjetos(row, headers, itemDay, tipo, horas) {
          const dayValue = new Date(itemDay?.Data)
          const month  = dayValue.getMonth();
          const year = dayValue.getFullYear();
          const mName = monthNames[month];
          const value = mName+" "+year 

          const cellIndex = headers.indexOf(value) + 1;

          if(cellIndex > 0){
          const cellUser = row.getCell(cellIndex);
          if (cellUser.value === null) {
            cellUser.value = Number(horas);
            return;
          }
          cellUser.value = Number(cellUser.value) + Number(horas);
          return;
        }
        return;
        }


        function updateCellTotal(row, headers, startCount, endCount) {

          for (i = startCount; i < endCount; i++) {
            months.forEach((item, index) => {
      
                const indexA = 7 + index;
                const cellT = row.getCell(headers.indexOf(item) + 1);
                const letter = getExcelColumnLetter(indexA);
                cellT.value =  { formula: `=SUM(${letter}${startCount}: ${letter}${endCount -1})` };
              })
            }
            return;
          }

   
        for (i = startRow; i < rowCount + startRow; i++) {

          let row = worksheet.getRow(i);

          const cellTipo = row.getCell(headersPessoas.indexOf('tipo') + 1);
         
          if(cellTipo.value === "Total"){
            cellTipo.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '50623A' } // Set the desired background color code
            };
          }

          const cellT = row.getCell(headersPessoas.indexOf('Nome') + 1);
  
          if(filteredEnded.some((item => item.Nome === cellT.value && item.Resultado === true))){
            cellT.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '90BE6D' } // Set the desired background color code
            };
          }else if(filteredEnded.some((item => item.Nome === cellT.value && item.Resultado === false))){
            cellT.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'C00000' } // Set the desired background color code
            };
          }
        }

        for (i = startRow; i < rowCount + startRow; i++) {
          let row = worksheet.getRow(i);
          const cellT = row.getCell(headers.indexOf('Total') + 1);
          const letter = getExcelColumnLetter(headers.length - 2);

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
  
  

        function setCellValue(row, columnName, value) {
          const cellIndex = headersPessoas.indexOf(columnName) + 1;
          const cell = row.getCell(cellIndex);
          cell.value = value;
          return;
        }

        //////////////////////////////////

        let worksheetPessoas;
        const worksheetTemplatePessoas = workbookTemplate.getWorksheet();
        if (!worksheetTemplatePessoas) {
          console.error('Template worksheet not found.');
          return; // Exit the loop or handle the error as needed
        }

        const worksheetNamePessoas = "Total";

        worksheetPessoas = workbook.addWorksheet(worksheetNamePessoas);
        worksheetPessoas.model = Object.assign({}, worksheetTemplatePessoas.model);
        worksheetPessoas.name = worksheetNamePessoas;


        // Copy the configuration (styles, formats, etc.) from the template to the new worksheet
        // Specify merged cell ranges manually
        const mergedCellRangesPessoas = [
          { from: { row: 1, col: 3 }, to: { row: 2, col: 7 } },
          { from: { row: 1, col: 8 }, to: { row: 2, col: 9 } },
          { from: { row: 3, col: 2 }, to: { row: 3, col: 7 } },
          { from: { row: 4, col: 2 }, to: { row: 4, col: 7 } },
          // Add more merged cell ranges as needed
        ];

          
        mergedCellRangesPessoas.forEach((range, index) => {
          worksheetPessoas.mergeCells(range.from.row, range.from.col, range.to.row, range.to.col);
          if (index === 0) {
            const month = dataWorksheet.getMonth()
            const year = dataWorksheet.getFullYear()
            const monthName = monthNamesComplete[month];
            const cell = worksheetPessoas.getCell(range.from.row, range.from.col);
            cell.value = `${monthName} ${year}`;
            cell.font = { size: 22 };
          }
        });
          
        // Copy cell values and style from the template
        worksheetTemplatePessoas.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const isExcluded =
              rowNumber >= 1 &&
              rowNumber <= 2 &&
              colNumber >= 3 &&
              colNumber <= 7;
            if (!isExcluded) {
              const newCell = worksheetPessoas.getCell(rowNumber, colNumber);
              newCell.value = cell.value;
              newCell.style = Object.assign({}, cell.style); // Copy cell style
            }
          });
        });

        // Write header row

        // Write header row starting from column 8
        const startColumnPessoas = 1;
        worksheetPessoas.addRow([]);
        const headerRowPessoas = worksheetPessoas.getRow(1);
        headerRowPessoas.font = { bold: true };
        headerRowPessoas.alignment = { horizontal: 'center' };
        headersPessoas.forEach((header, index) => {
          worksheetPessoas.getCell(5, startColumnPessoas + index).value = header;
        });
        // Write data rows
        const startRowPessoas = 6;
        let rowCountPessoas = 0;



        const arrayTTPessoas = [];
        reorderedData?.forEach((item, index) => {

          arrayTTPessoas[index] = [];

            let row = worksheetPessoas?.getRow(startRowPessoas + rowCountPessoas);

            headersPessoas?.forEach((header, columnIndex) => {
              let value = item[header] || '';
    
              // Modify the values based on the header
              if (['DataInicio', 'DataFim'].includes(header)) {
                value = new Date(value)?.toLocaleDateString();
                if (value === "Invalid Date") {
                  value = ''
                }
              }
              if (columnIndex < 6) {
                row.getCell(columnIndex + 1).value = value;
              }
              // Consider adding comments for context and explanations
              let count = rowCountPessoas;
              const countStart = startRowPessoas + rowCountPessoas
              if (['tipo'].includes(header)) {
                dataD?.forEach((itemDay, indexDay) => {

                    for (let i = 0; i < itemDay?.tipoDeTrabalhoHoras?.length; i++) {
                      if (itemDay?.tipoDeTrabalhoHoras[i]?.projeto === item?.Nome) {
                        const tipoT = itemDay?.tipoDeTrabalhoHoras[i]?.tipoTrabalho.split(",");
                        const splitHoras = itemDay?.tipoDeTrabalhoHoras[i]?.horas.split(",");

                        for (let t = 0; t < tipoT.length; t++) {
                          
                          if (splitHoras[t] !== "0" && splitHoras[t] !== 0) {
                            if (!arrayTTPessoas[index].some(item => item.value === tipoT[t])) {
                              
                              if ((Array.isArray(arrayTTPessoas[index]) && arrayTTPessoas[index].length > 0)) {
                                rowCountPessoas++;
                                count = rowCountPessoas;
                                columnIndex++;

                              }
                              
                              arrayTTPessoas[index].push({ value: tipoT[t], rowCountPessoas: rowCountPessoas });
  
                            } else {

                              const existingItem = arrayTTPessoas[index].find(item => item.value === tipoT[t]);

                              if (existingItem) {
                                count = existingItem.rowCountPessoas;
                              }
                            }

                            row = worksheetPessoas.getRow(startRowPessoas + count);
                            setCellValue(row, '_id_P', item._id_P);
                            setCellValue(row, 'Cliente', item.Cliente);
                            setCellValue(row, 'Nome', item.Nome);
                            setCellValue(row, 'DataInicio', formatDateString(item.DataInicio));
                            setCellValue(row, 'DataFim', formatDateString(item.DataFim));
                            setCellValue(row, 'tipo', tipoT[t]);
                            updateCellPessoas(row, headersPessoas, itemDay, tipoT[t], splitHoras[t]);
                          }
                        }
                      }
                    }
                  
                });

                row = worksheetPessoas.getRow(startRow + rowCountPessoas);
                const countEnd = startRowPessoas + rowCountPessoas

                setCellValue(row, '_id_P', item._id_P);
                setCellValue(row, 'Cliente', item.Cliente);
                setCellValue(row, 'Nome', item.Nome);
                setCellValue(row, 'DataInicio', formatDateString(item.DataInicio));
                setCellValue(row, 'DataFim', formatDateString(item.DataFim));
                setCellValue(row, 'tipo', 'Total');
                updateCellTotalPessoas(row, headersPessoas, countStart, countEnd);
              }
            });
            rowCountPessoas++;
        });


        let rowNumberPessoas = 0
        for (let row = 6; ; row++) {
          const cellCheck = worksheetPessoas.getCell(row, 2).value;
          const cellValue = worksheetPessoas.getCell(row, 7).value;
          if (cellValue === "Adicionar Horas Extra") {
            // Print or use the row number as needed
            rowNumberPessoas = row;
            break;
          }
        
          // Break the loop if there are no more rows
          if (!cellCheck) {
            break;
          }
        }



        function formatDateString(dateString) {
          const date = new Date(dateString).toLocaleDateString();
          // Add logic to format date strings as needed
          if (date === "01/01/1970") {
            return '';
          }
          return date;
        }


        function updateCellPessoas(row, headersPessoas, itemDay, tipo, horas) {

          const value = itemDay.Utilizador;
          const cellIndex = headersPessoas.indexOf(value) + 1;

          if(cellIndex > 0){
          const cellUser = row.getCell(cellIndex);
          if (cellUser.value === null) {
            cellUser.value = Number(horas);
            return;
          }
          cellUser.value = Number(cellUser.value) + Number(horas);
          return;
        }
        return;
        }

        function updateCellTotalPessoas(row, headersPessoas, startCount, endCount) {
          for (i = startCount; i < endCount; i++) {
            nomeUsers.forEach((item, index) => {
                const indexA = 7 + index;
                const cellT = row.getCell(headersPessoas.indexOf(item) + 1);
                const letter = getExcelColumnLetter(indexA);
                cellT.value =  { formula: `=SUM(${letter}${startCount}: ${letter}${endCount -1})` };
              })
            }
            return;
          }

        for (i = startRowPessoas; i < rowCountPessoas + startRowPessoas; i++) {
          let row = worksheetPessoas.getRow(i);

          const cellTipo = row.getCell(headersPessoas.indexOf('tipo') + 1);
         
          if(cellTipo.value === "Total"){
            cellTipo.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '50623A' }
            };
          }





          const cellT = row.getCell(headersPessoas.indexOf('Nome') + 1);
  
          if(filteredEnded.some((item => item.Nome === cellT.value && item.Resultado === true))){
            cellT.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '90BE6D' } // Set the desired background color code
            };
          }else if(filteredEnded.some((item => item.Nome === cellT.value && item.Resultado === false))){
            cellT.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'C00000' } // Set the desired background color code
            };
          }
        }

    
        for (i = startRowPessoas; i < rowCountPessoas + startRowPessoas; i++) {
          let row = worksheetPessoas.getRow(i);
          const cellT = row.getCell(headersPessoas.indexOf('Total') + 1);
          const letter = getExcelColumnLetter(headersPessoas.length - 2);

          cellT.value = { formula: `=SUM(H${i}:${letter}${i})` };
        }
        headersF.forEach((header, index) => {
          worksheetPessoas.getCell(5, index + 1).value = header;
        });
        // Auto-fit columns
        worksheetPessoas.columns.forEach((column, columnIndex) => {
          if (column && column.header) {
            column.width = column.header.length < 10 ? 10 : column.header.length;
          }
        });
  
  


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
    console.error("Error Export Horas", error);
    ret = false;
  }
  return ret;
}

module.exports = {
  exportExcellHoursProjetos,
};
