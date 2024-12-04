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
  try {
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
  } catch (error) {
    console.error(error)
  }
}

function getPossibleHoursCount(month, year) {
  try {
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
  } catch (error) {
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
let excelFilePath = process.env.EXTRACTION_FOLDER;

// Excel template file path
const templateFilePath = './TemplateHoras.xlsx';
const templateFilePathHorasExtra = './TemplateHorasExtra.xlsx';

const exportExcell = async (tipo) => {

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

    dataU.sort((a, b) => a.tipo - b.tipo);

    if (Number(tipo) === 2) {
      dataU.forEach((item, index) => {
        excelFilePath = process.env.EXTRACTION_FOLDER;

        if (item.nome !== "Admin") {
          nomeUsers.push(item.nome);
        }
      })
    } else if (Number(tipo) === 5) {
      excelFilePath = process.env.EXTRACTION_FOLDER5;
      dataU.forEach((item, index) => {
        if (item.nome !== "Admin" && (Number(item?.tipo) === 1 || Number(item?.tipo) === 2 || Number(item?.tipo) === 5)) {
          nomeUsers.push(item.nome);
        }
      })
    } else if (Number(tipo) === 6) {
      excelFilePath = process.env.EXTRACTION_FOLDER6;
      dataU.forEach((item, index) => {
        if (item.nome !== "Admin" && (Number(item?.tipo) === 3 || Number(item?.tipo) === 6)) {
          nomeUsers.push(item.nome);
        }
      })
    } else if (Number(tipo) === 7) {
      excelFilePath = process.env.EXTRACTION_FOLDER7;
      dataU.forEach((item, index) => {
        if (item.nome !== "Admin" && (Number(item?.tipo) === 4 || Number(item?.tipo) === 7)) {
          nomeUsers.push(item.nome);
        }
      })
    } else if (Number(tipo) === 8) {
      excelFilePath = process.env.EXTRACTION_FOLDER8;
      dataU.forEach((item, index) => {
        if (item.nome !== "Admin" && (Number(item?.tipo) === 2 || Number(item?.tipo) === 5 || Number(item?.tipo) === 6 || Number(item?.tipo) === 7)) {
          nomeUsers.push(item.nome);
        }
      })
    }

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
    const workbookTemplateHorasExtra = new ExcelJS.Workbook();

    const dataWorksheet = new Date();
    const dateStart = new Date(2023, 5);

    await workbookTemplate.xlsx.readFile(templateFilePath);
    await workbookTemplateHorasExtra.xlsx.readFile(templateFilePathHorasExtra);

    const monthNames = ["JAN", "FEB", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const monthNamesComplete = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];


    nomeUsers.sort();

    // Initialize countExtra object with sorted usernames
    const countExtra = {};
    nomeUsers.forEach((header) => {
      countExtra[header] = 0;
    });

    const projetoGeral = (data.filter(item => item.Nome === "Geral"));

    if (projetoGeral.length > 0) {
      projetoGeral[0].Cliente = "Interno";
    }


    const reorderedData = [...projetoGeral, ...data.filter(item => item.Nome !== "Geral")];

    const compensacao = dataTT.filter(item => item.tipo === 4);
    const addHorasExtra = dataTT.filter(item => item.tipo === 5);


    dataD.forEach((itemDay, indexDay) => {
      const dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));

      const startDay = dayStart.getDate();
      const startMonth = dayStart.getMonth();
      const startYear = dayStart.getFullYear();

      const date = new Date(itemDay?.Data);
      const dayOfWeek = date.getDay();

      const currentDay = date.getDate();
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();

      if ((
        currentYear > startYear ||
        currentMonth > startMonth ||
        (
          currentYear === startYear &&
          currentMonth === startMonth &&
          currentDay >= startDay)
      ) && nomeUsers.includes(itemDay?.Utilizador)) {
        let extraHours = 0;

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isFriday = dayOfWeek === 5;

        for (let i = 0; i < itemDay.tipoDeTrabalhoHoras.length; i++) {
          const projeto = itemDay.tipoDeTrabalhoHoras[i];
          if (projeto.projeto === projetoGeral[0]?.Nome) {
            const tt = projeto.tipoTrabalho.split(',') || [];
            const ttH = projeto.horas.split(',') || [];

            for (let j = 0; j < tt.length; j++) {
              if (tt[j] === compensacao[0]?.TipoTrabalho) {
                countExtra[itemDay?.Utilizador] -= parseFloat(ttH[j]);
              }
              if (tt[j] === addHorasExtra[0]?.TipoTrabalho) {
                countExtra[itemDay?.Utilizador] += parseFloat(ttH[j]);
                extraHours = parseFloat(ttH[j]);
              }
            }
          }
        }



        if (useFeriadosPortugal(date) && (parseFloat(itemDay?.NumeroHoras) - parseFloat(extraHours)) > 0) {
          countExtra[itemDay?.Utilizador] += parseFloat(parseFloat(itemDay?.NumeroHoras) - parseFloat(extraHours));
        } else if (isWeekend && (parseFloat(itemDay?.NumeroHoras) - parseFloat(extraHours)) > 0) {
          countExtra[itemDay?.Utilizador] += parseFloat(parseFloat(itemDay?.NumeroHoras) - parseFloat(extraHours));
        } else if (isFriday && (parseFloat(itemDay?.NumeroHoras) - parseFloat(extraHours)) > 6) {
          countExtra[itemDay?.Utilizador] += parseFloat(parseFloat(itemDay?.NumeroHoras - 6) - parseFloat(extraHours));
        } else if (!isFriday && (parseFloat(itemDay?.NumeroHoras) - parseFloat(extraHours)) > 8.5) {
          countExtra[itemDay?.Utilizador] += parseFloat(parseFloat(itemDay?.NumeroHoras - 8.5) - parseFloat(extraHours));
        }
      }
    });



    let worksheet;
    const worksheetTemplateHorasExtra = workbookTemplateHorasExtra.getWorksheet();
    if (!worksheetTemplateHorasExtra) {
      console.error('Template worksheet not found.');
      return; // Exit the loop or handle the error as needed
    }

    const worksheetName = "HorasExtra";

    worksheet = workbook.addWorksheet(worksheetName);
    worksheet.model = Object.assign({}, worksheetTemplateHorasExtra.model);
    worksheet.name = worksheetName;

    const headersHorasExtra = [
      '',
      'Utilizador',
      'Horas Extra',
      '',
    ];


    // Specify merged cell ranges manually
    const mergedCellRanges = [
      { from: { row: 1, col: 2 }, to: { row: 2, col: 3 } },
      { from: { row: 1, col: 8 }, to: { row: 2, col: 9 } },
      // Add more merged cell ranges as needed
    ];


    mergedCellRanges.forEach((range, index) => {
      worksheet.mergeCells(range.from.row, range.from.col, range.to.row, range.to.col);
      if (index === 0) {
        const cell = worksheet.getCell(range.from.row, range.from.col);
        cell.font = { size: 22 };
      }
    });

    // Copy cell values and style from the template
    worksheetTemplateHorasExtra.eachRow({ includeEmpty: false }, (row, rowNumber) => {
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

    headersHorasExtra.forEach((header, index) => {
      worksheet.getCell(3, index + 1).value = header;
    });

    // Auto-fit columns
    worksheet.columns.forEach((column, columnIndex) => {
      if (column && column.header) {
        column.width = column.header.length < 10 ? 10 : column.header.length;
      }
    });

    const userKeys = Object.keys(countExtra);

    for (let i = 0; i < userKeys.length; i++) {
      const user = userKeys[i];
      let row = worksheet.getRow(i + 4);
      const cellUser = row.getCell(2);
      const cellHorasExtra = row.getCell(3);

      cellUser.value = user;
      cellHorasExtra.value = countExtra[user];
    }


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
        let worksheet;
        const worksheetTemplate = workbookTemplate.getWorksheet();
        if (!worksheetTemplate) {
          console.error('Template worksheet not found.');
          return; // Exit the loop or handle the error as needed
        }

        const worksheetName = monthNames[month] + " " + year;

        worksheet = workbook.addWorksheet(monthNames[month]);
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
          const cell = worksheet.getCell(5, startColumn + index)
          cell.value = header;

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'fff2f2f2' },
          };

          cell.font = {
            bold: true,
            size: 9,
          };

          // Set alignment to center (horizontal and vertical)
          cell.alignment = {
            horizontal: 'start',
            vertical: 'top',
            wrapText: true,
          };

          // Apply filter to the entire header row
          worksheet.autoFilter = {
            from: {
              row: 5,
              column: startColumn + 1,
            },
            to: {
              row: 5,
              column: startColumn + headers.length - 1,
            },
          };
        });

        // Write data rows
        const startRow = 6;
        let rowCount = 0;


        const arrayTT = [];
        reorderedData?.forEach((item, index) => {
          if (tipo?.toString() === "2" || tipo?.toString() === "5" || tipo?.toString() === "8" || item.Nome === "Geral") {
            if (!item?.Finalizado || (item.DataFim && item?.DataFim?.getMonth() >= month) && (item?.DataInicio && item?.DataInicio?.getMonth() <= month)) {
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
                if (['tipo'].includes(header)) {
                  dataD?.forEach((itemDay, indexDay) => {
                    if (itemDay?.Data?.getMonth() === month && itemDay?.Data?.getFullYear() === year && nomeUsers.includes(itemDay?.Utilizador)) {

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
          }
        });


        let rowNumber = 0
        for (let row = 6; ; row++) {
          const cellCheck = worksheet.getCell(row, 2).value;
          const cellValue = worksheet.getCell(row, 7).value;
          if (cellValue === "Adicionar Horas Extra") {
            // Print or use the row number as needed
            rowNumber = row;
            break;
          }

          // Break the loop if there are no more rows
          if (!cellCheck) {
            break;
          }
        }

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

          cellUser.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };

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
          if (rowNumber > 0) {


            const possibleH = getPossibleHoursCount(month, year);

            const cell1 = worksheet.getCell(1, indexA);


            cell1.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            const cell2 = worksheet.getCell(2, indexA);


            cell2.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            const cell3 = worksheet.getCell(3, indexA)
            cell3.value = { formula: `=(SUM(${letter}6:${letter}${rowCount + 5}) - ${letter}${rowNumber}) / ${possibleH}` };

            // Format the cell as a percentage
            cell3.numFmt = '0.00%';

            cell3.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            cell3.font = {
              bold: true,
              size: 9,
            };

            // Set alignment to center (horizontal and vertical)
            cell3.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };


            const cell4 = worksheet.getCell(4, indexA)
            cell4.value = { formula: `=${possibleH} - (SUM(${letter}6:${letter}${rowCount + 5}) - ${letter}${rowNumber})` };

            cell4.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            cell4.font = {
              bold: true,
              size: 9,
            };

            // Set alignment to center (horizontal and vertical)
            cell4.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
          } else {

            const possibleH = getPossibleHoursCount(month, year);


            const cell1 = worksheet.getCell(1, indexA);


            cell1.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            const cell2 = worksheet.getCell(2, indexA);


            cell2.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            const cell3 = worksheet.getCell(3, indexA);
            if (header === "Total") {
              const divisor = (possibleH * (headersNamesT.length - 1));
              cell3.value = { formula: `SUM(${letter}${6}:${letter}${rowCount + 5})/${divisor}` };
            } else {
              cell3.value = { formula: `SUM(${letter}${6}:${letter}${rowCount + 5})/${possibleH}` };
            }
            // if (['Total'].includes(header)) {
            //   const letter = getExcelColumnLetter(indexA - 2);
            //   const letterS = getExcelColumnLetter(7);
            //   worksheet.getCell(2, indexA).value = 'Total:';
            //   worksheet.getCell(3, indexA).value = { formula: `=SUM(${letterS}${3}: ${letter}${3})/COUNT(${letterS}3:${letter}3)` };
            //   worksheet.getCell(4, indexA).value = { formula: `=SUM(${letterS}${4}: ${letter}${4})` };
            //   //"=SOMA(H3:S3)/CONTAR(H3:S3)"
            // }


            // Format the cell as a percentage
            cell3.numFmt = '0.00%';

            cell3.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            cell3.font = {
              bold: true,
              size: 9,
            };

            // Set alignment to center (horizontal and vertical)
            cell3.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
            const cell4 = worksheet.getCell(4, indexA);
            if (header === "Total") {
              const divisor = (possibleH * (headersNamesT.length - 1));
              cell4.value = { formula: `=+${divisor}-SUM(${letter}${6}: ${letter}${rowCount + 5})` };
            } else {
              cell4.value = { formula: `=+${possibleH}-SUM(${letter}${6}: ${letter}${rowCount + 5})` };
            }

            cell4.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb8cce4' },
            };

            cell4.font = {
              bold: true,
              size: 9,
            };

            // Set alignment to center (horizontal and vertical)
            cell4.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
          }

          // if (['Total'].includes(header)) {
          //   const letter = getExcelColumnLetter(indexA - 2);
          //   const letterS = getExcelColumnLetter(7);
          //   worksheet.getCell(2, indexA).value = 'Total:';
          //   worksheet.getCell(3, indexA).value = { formula: `=SUM(${letterS}${3}: ${letter}${3})/COUNT(${letterS}3:${letter}3)` };
          //   worksheet.getCell(4, indexA).value = { formula: `=SUM(${letterS}${4}: ${letter}${4})` };
          //   //"=SOMA(H3:S3)/CONTAR(H3:S3)"
          // }
        });


        const getPossibleDays = getPossibleDaysCount(month, year);
        worksheet.getCell(2, 2).value = getPossibleDays;


        const totalRow = startRow + rowCount;
        let row = worksheet?.getRow(totalRow + 1);
        const mergedCellRangesTotal = [
          { from: { row: totalRow + 1, col: 2 }, to: { row: totalRow + 1, col: 7 } },
          // Add more merged cell ranges as needed
        ];

        mergedCellRangesTotal.forEach((range, index) => {
          worksheet.mergeCells(range.from.row, range.from.col, range.to.row, range.to.col);
          if (index === 0) {
            const cellM = worksheet.getCell(range.from.row, range.from.col);
            cellM.value = `Total:`;
            cellM.font = { size: 15 };
            cellM.alignment = {
              horizontal: 'right',
              vertical: 'middle',
            };

            cellM.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'fff2f2f2' },
            };

            row.height = 30;

          }
        });
        for (i = 7; i <= headers.length; i++) {

          const cellT = row.getCell(i + 1);


          if (i === headers.length) {


          } else {
            const letter = getExcelColumnLetter(i);

            cellT.value = { formula: `=SUM(${letter}${6}:${letter}${rowCount + startRow - 1})` };
          }
          cellT.alignment = {
            horizontal: 'center',
            vertical: 'middle', // Use 'middle' instead of 'center'
            wrapText: true
          };


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
    console.error("Error Export Horas", error);
    ret = false;
  }
  return ret;
}

module.exports = {
  exportExcell,
};
