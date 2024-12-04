const mongoose = require('mongoose');
require('dotenv').config();
const ExcelJS = require('exceljs');
const ObjectId = mongoose.Types.ObjectId;

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

  for (let i = year; i <= year; i++) {
    holidays.push(
      { name: "Ano Novo", date: new Date(i, 0, 1) },
      { name: "Dia da Liberdade", date: new Date(i, 3, 25) },
      { name: "Dia do Trabalhador", date: new Date(i, 4, 1) },
      { name: "Dia de Portugal", date: new Date(i, 5, 10) },
      { name: "Assunção de Nossa Senhora", date: new Date(i, 7, 15) },
      { name: "Férias Coletivas", date: new Date(2024, 7, 16) },
      { name: "Implantação da República", date: new Date(i, 9, 5) },
      { name: "Dia de Todos os Santos", date: new Date(i, 10, 1) },
      { name: "Restauração da Independência", date: new Date(i, 11, 1) },
      { name: "Dia da Imaculada Conceição", date: new Date(i, 11, 8) },
      { name: "Feriado Municipal", date: new Date(i, 2, 12) },
      { name: "Férias Coletivas", date: new Date(i, 11, 24) },
      { name: "Natal", date: new Date(i, 11, 25) },
      { name: "Férias Coletivas", date: new Date(i, 11, 26) },
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


const isHoliday = (date, holidays) => {
  const foundHoliday = holidays.find(holiday => {
    return (
      holiday.date.getDate() === date.getDate() &&
      holiday.date.getMonth() === date.getMonth() &&
      holiday.date.getFullYear() === date.getFullYear()
    );
  });

  if (foundHoliday) {
    return foundHoliday.name;
  }

  return false;
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


function getTipoUtilizador(tipo) {
  try {
    let value = "";
    switch (tipo) {
      case 1:
        value = "Engenharia de Processos";
        break;
      case 2:
        value = "Administrador";
        break;

      case 3:
        value = "Laboratorio";
        break;
      case 4:
        value = "Recursos Humanos";

        break;
      case 5:
        value = "Administrador Engenharia";
        break;
      case 6:
        value = "Administrador Laboratorio";
        break;
      case 7:
        value = "Administrador Recursos Humanos";
        break;
      case 8:
        value = "Inativo";
        break;
      case 9:
        value = "Responsavel Qualidade";
        break;
      case 10:
        value = "Gestor Financeiro";
        break;
      case 11:
        value = "Comercial";
        break;
      case 12:
        value = "Logistica";
        break;
      default:
        value = "Não encontrado";
        break;
    }

    return value;
  } catch (error) {
    return "Não encontrado"
  }
}

let ret = false;

const collectionUtilizadores = 'utilizadores';

// Excel file path and name
let excelFilePath = process.env.EXTRACTION_FOLDER_FERIAS;

// Excel template file path
const templateFilePath = './TemplateHorasFeriasInserted.xlsx';
const templateFilePathHorasExtra = './TemplateHorasFerias.xlsx';

const exportExcell = async (listaFerias, tipo, projetoGeral, date) => {
  try {
    // Connect to MongoDB
    const url = process.env.MONGO_URI;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    // Fetch data from MongoDB

    const collectionU = mongoose.connection.db.collection(collectionUtilizadores);

    let dataU = await collectionU.find({}, { projection: { foto: 0, email: 0, password: 0, resetPasswordExpires: 0, resetPasswordToken: 0 } }).toArray();

    // const UsersAll = await User.find({ tipo: { $ne: "8" } }, { foto: 0, email: 0, password: 0 });


    let nomeUsers = []

    dataU.sort((a, b) => {
      const tipoComparison = a.tipo - b.tipo;


      if (tipoComparison === 0) {
        return a.nome.localeCompare(b.nome);
      }


      return tipoComparison;
    });

    // const getTipo = () => {
    //   let tipo = 0;
    //   if (selectedUser === "Todos") {
    //     tipo = 0;
    //   } else if (selectedUser === "Engenharia de Processos") {
    //     tipo = 1;
    //   } else if (selectedUser === "Administradores") {
    //     tipo = 2;
    //   }
    //   else if (selectedUser === "Laboratorio") {
    //     tipo = 3;
    //   } else if (selectedUser === "Outro") {
    //     tipo = 4;
    //   } else if (selectedUser === "Responsavel") {
    //     tipo = 5;
    //   }
    //   return tipo;
    // }

    let tipoName = "";

    if (Number(tipo) === 0) {
      tipoName = "";
      dataU = dataU.filter((item, index) => {

        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && Number(item?.tipo) !== 8) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    } else if (Number(tipo) === 1) {
      tipoName = "Engenharia Processos";
      dataU = dataU.filter((item, index) => {
        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && (Number(item?.tipo) === 1 || Number(item?.tipo) === 5)) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    } else if (Number(tipo) === 2) {
      tipoName = "Administradores";
      dataU = dataU.filter((item, index) => {
        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && (Number(item?.tipo) === 2 || Number(item?.tipo) === 5 || Number(item?.tipo) === 6 || Number(item?.tipo) === 7)) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    } else if (Number(tipo) === 3) {
      tipoName = "Laboratorio";
      dataU = dataU.filter((item, index) => {
        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && (Number(item?.tipo) === 3 || Number(item?.tipo) === 6)) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    } else if (Number(tipo) === 4) {
      tipoName = "Outro";
      dataU = dataU.filter((item, index) => {
        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && (Number(item?.tipo) === 9 || Number(item?.tipo) === 10 || Number(item?.tipo) === 11 || Number(item?.tipo) === 12)) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    } else if (Number(tipo) === 5) {
      tipoName = "Recursos Humanos";
      dataU = dataU.filter((item, index) => {
        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && (Number(item?.tipo) === 4 || Number(item?.tipo) === 7)) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    } else if (Number(tipo) === 6) {
      tipoName = "Comercial";
      dataU = dataU.filter((item, index) => {
        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && (Number(item?.tipo) === 2 || Number(item?.tipo) === 5 || Number(item?.tipo) === 6 || Number(item?.tipo) === 7)) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    } else if (Number(tipo) === 7) {
      tipoName = "Logistica";
      dataU = dataU.filter((item, index) => {
        if (item.nome !== "Admin" && Number(item?.tipo) !== 8 && (Number(item?.tipo) === 2 || Number(item?.tipo) === 5 || Number(item?.tipo) === 6 || Number(item?.tipo) === 7)) {
          nomeUsers.push(item.nome);
          return true;
        }
        return false;
      })
    }

    let calendarDays = []



    const headersF = [
      '',
      'UTILIZADOR',
      'TIPO',
      'NUMERO DIAS',
    ];


    // Load Excel template
    const workbook = new ExcelJS.Workbook();
    const workbookTemplate = new ExcelJS.Workbook();
    const workbookTemplateHorasExtra = new ExcelJS.Workbook();

    const dataWorksheet = new Date(date);

    const dateStart = new Date(date);

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


    if (projetoGeral.length > 0) {
      projetoGeral[0].Cliente = "Interno";
    }


    const reorderedData = [projetoGeral, listaFerias];




    let worksheet;
    const worksheetTemplateHorasExtra = workbookTemplateHorasExtra.getWorksheet();
    if (!worksheetTemplateHorasExtra) {
      console.error('Template worksheet not found.');
      return; // Exit the loop or handle the error as needed
    }

    const worksheetName = "Dias Férias";

    worksheet = workbook.addWorksheet(worksheetName);
    worksheet.model = Object.assign({}, worksheetTemplateHorasExtra.model);
    worksheet.name = worksheetName;

    const headersFeriasExtra = [
      '',
      'Utilizador',
      'Dias Aceites',
      'Dias Possiveis',
      'Dias por Reclamar'
    ];


    // Specify merged cell ranges manually
    const mergedCellRanges = [
      { from: { row: 1, col: 2 }, to: { row: 2, col: 5 } },

      // Add more merged cell ranges as needed
    ];


    mergedCellRanges.forEach((range, index) => {
      worksheet.mergeCells(range.from.row, range.from.col, range.to.row, range.to.col);
      if (index === 0) {
        const year = dateStart.getFullYear();
        const month = dateStart.getMonth();

        const cell = worksheet.getCell(range.from.row, range.from.col);

        cell.font = { size: 21 };
        if (month !== 11) {
          // cell.value = `FÉRIAS ${year} ${tipoName} (${monthNamesComplete[month]})`;
          cell.value = `FÉRIAS ${year} ${tipoName}`;
        } else {
          cell.value = `FÉRIAS ${year} ${tipoName}`;
        }
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
          // newCell.value = cell.value;
          newCell.style = Object.assign({}, cell.style); // Copy cell style
        }
      });
    });

    headersFeriasExtra.forEach((header, index) => {
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
      let row = worksheet.getRow(i + 4);
      const cellUser = row.getCell(2);
      const cellAceites = row.getCell(3);
      const cellPossiveis = row.getCell(4);
      const cellPorReclamar = row.getCell(5);

      const user = userKeys[i];

      {
        listaFerias && Object.keys(listaFerias).length > 0 && Object.values(listaFerias).map((ferias, index) => {
          const indexKey = (Object.keys(listaFerias)[index]);
          const userName = indexKey.split(",");
          const totalNumberAll = ferias[1].reduce((acc, numberF) => {
            const number = numberF.Numero;
            return acc + number;
          }, 0);

          const Ano = dateStart.getFullYear();
          const Mes = dateStart.getMonth();
          const totalNumber = (ferias[0].reduce((acc, numberF) => {
            let number = 0;
            const date = new Date(numberF.Data);
            if (date.getFullYear() <= Ano && (date.getMonth() <= Mes)) {
              number = 1;
            }
            return acc + number;
          }, 0));

          const totalNumberMap = {};

          // Calculate the total number for each item in ferias[1]
          const totalNumberPossiveis = ferias[1].reduce((acc, numberF) => {

            const dataAno = numberF.Ano;
            let number = 0;

            // Only calculate totalNumber if the year has not been processed yet
            if (dataAno <= Ano) {
              number = numberF.Numero;
              // Calculate totalNumber for the current year if not already calculated
              if (!(dataAno in totalNumberMap)) {
                const totalNumber = ferias[0].reduce((acc, numberF) => {
                  let numberYear = 0;
                  const date = new Date(numberF.Data);

                  if (date.getFullYear() < dataAno) {
                    numberYear = 1;
                  }

                  return acc + numberYear;
                }, 0);

                totalNumberMap[dataAno] = totalNumber; // Store the calculated totalNumber

                number -= totalNumber; // Deduct totalNumber from number
              }

            }

            return acc + number;
          }, 0);


          let feriasPorDar = totalNumberPossiveis - totalNumber;
          if (user === userName[0]) {
            cellAceites.value = totalNumber;
            cellPossiveis.value = totalNumberPossiveis;
            cellPorReclamar.value = feriasPorDar;
          }
        })
      }



      cellUser.value = user;

    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // workbookTemplate
    const year = dateStart.getFullYear();
    const currentYear = (new Date()).getFullYear();
    const startMonth = dateStart.getMonth();

    let monthCheck = dataWorksheet.getMonth();

    let month = 0;

    if (currentYear === year) {
      monthCheck = dataWorksheet.getMonth()
    } else {
      monthCheck = 11;
    }




    for (month; month <= monthCheck; month++) {
      // Define column headers and styling
      const days = new Date(year, month + 1, 0).getDate();
      let daysHeader = [];
      let daysHeaderCheck = [];
      for (let day = 1; day <= days; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const isHoliday = useFeriadosPortugal(date);
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
          daysHeaderCheck.push([day, 0])
        } else if (isHoliday) {
          daysHeaderCheck.push([day, 2])
        } else {
          daysHeaderCheck.push([day, 1])
        }
        daysHeader.push(day)
      }

      const headers = [
        '',
        'UTILIZADOR',
        'TIPO',
        'NUMERO DIAS',
        ...daysHeader,

      ];
      //        'Total',

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
      const maxLengthCol = headers.length;
      const mergedCellRanges = [
        { from: { row: 1, col: 3 }, to: { row: 2, col: 7 } },
        { from: { row: 1, col: 8 }, to: { row: 4, col: maxLengthCol } },
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


      // Write header row starting from column 8
      const startColumn = 1;
      worksheet.addRow([]);
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };

      let collumnHeaders = []

      headers.forEach((header, index) => {

        const cell = worksheet.getCell(5, startColumn + index);  // Get the cell in row 5

        if (index > 3 && index <= headers.length - 1) {
          if (daysHeaderCheck[index - 4][1] === 1) {
            collumnHeaders.push([index + startColumn, 1])
            // Set background color for the header 
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffbcb8b1' },
            };

          } else if (daysHeaderCheck[index - 4][1] === 2) {
            collumnHeaders.push([index + startColumn, 2])
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffc26c18' },
            };
          } else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'fff2f2f2' },  //
            };
          }
        } else {
          // Set background color for the header 
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'fff2f2f2' },  // Light blue color in ARGB format
          };

        }

        // Set bold text for the header
        cell.font = { bold: true };

        // Set border for the header
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
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

        cell.value = header;
      });


      // Write data rows
      const startRow = 6;
      let rowCount = 0;



      const arrayTT = [];


      dataU?.forEach((item, index) => {
        arrayTT[index] = [];
        let row = worksheet?.getRow(startRow + rowCount);

        headers?.forEach((header, columnIndex) => {
          const cell = row.getCell(columnIndex + 1);

          // Default cell styling
          cell.font = {
            color: { argb: 'ff000000' }, // Black color by default
            bold: false,
            size: 14,
          };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'center',
          };
          cell.fill = {
            type: 'pattern',
            fgColor: { argb: 'FFFFFFFF' }, // Default white background
          };

          let value = item[header] || '';
          let days = [];
          let totalNumber = 0;

          // Check if listaFerias is present and correctly formatted
          if (listaFerias && Object.keys(listaFerias).length > 0) {
            Object.values(listaFerias).forEach((ferias, index) => {
              const indexKey = Object.keys(listaFerias)[index];
              const userName = indexKey.split(",");
              const idCompare = new ObjectId(userName[1]);

              // Compare the ID to match ferias with user
              if (item._id.equals(idCompare)) {
                const Ano = dateStart.getFullYear();
                totalNumber = ferias[0].reduce((acc, numberF) => {
                  let number = 0;
                  const date = new Date(numberF.Data);
                  if (date.getFullYear() === Ano && date.getMonth() === month) {
                    number = 1;
                    days.push(date.getDate());
                  }
                  return acc + number;
                }, 0);
              }
            });
          }

          // Assign correct value based on the header
          if (header === 'UTILIZADOR') {
            value = item.nome;  // Correctly set user name
          } else if (header === 'TIPO') {
            value = getTipoUtilizador(item.tipo);  // Set user type
          } else if (header === 'NUMERO DIAS') {
            const letter = getExcelColumnLetter(headers.length - 1);
            const startLetter = getExcelColumnLetter(4)
            value = { formula: `=COUNTA(${startLetter}${startRow + rowCount}:${letter}${rowCount + startRow})` };
            // value = totalNumber;  // Calculate total days
          } else {
            // If the header represents a day (number)
            if (days.includes(Number(header))) {

              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffb7b5e4' }, // Set highlight color for the "X" marker
              };
              cell.font = {
                color: { argb: 'FFFF0000' }, // Red text color for "X"
                bold: true,
                size: 14,
              };
              value = 'X';  // Mark the day with "X"
            } else {
              // Ensure blank cells have default background and no marker
              cell.fill = {
                type: 'pattern',
                fgColor: { argb: 'FFFFFFFF' }, // Ensure white background
              };
              cell.font = {
                color: { argb: 'ff000000' }, // Black color by default
                bold: false,
                size: 14,
              };
              value = null;  // Set blank if no match for day
            }
          }

          // Assign the final value to the cell
          cell.value = value;

        });

        rowCount++;  // Move to the next row
      });



      const getPossibleDays = getPossibleDaysCount(month, year);
      worksheet.getCell(2, 2).value = getPossibleDays;

      const totalRow = startRow + rowCount
      let row = worksheet?.getRow(totalRow + 1);
      const mergedCellRangesTotal = [
        { from: { row: totalRow + 1, col: 2 }, to: { row: totalRow + 1, col: 3 } },
        // Add more merged cell ranges as needed
      ];




      mergedCellRangesTotal.forEach((range, index) => {
        worksheet.mergeCells(range.from.row, range.from.col, range.to.row, range.to.col);
        if (index === 0) {
          const cellM = worksheet.getCell(range.from.row, range.from.col);
          cellM.value = `Total:`;
          cellM.font = { size: 24 };
          cellM.alignment = {
            horizontal: 'right',
            vertical: 'middle',
          };
          row.height = 30;
        }
      });

      const hollidays = getHolidaysForYear(year)


      for (i = 3; i <= headers.length; i++) {
        const checkDate = new Date(Date.UTC(year, month, headers[i]));
        const cellT = row.getCell(i + 1);

        const isH = isHoliday(checkDate, hollidays)

        if (i === headers.length) {


        } else if (isH) {
          cellT.value = isH;
          cellT.value

        } else if (i === 3) {

          const letter = getExcelColumnLetter(i);
          cellT.value = { formula: `=SUM(${letter}${6}:${letter}${rowCount + startRow - 1})` };
        } else {
          const letter = getExcelColumnLetter(i);

          cellT.value = { formula: `=COUNTA(${letter}${6}:${letter}${rowCount + startRow - 1})` };
        }
        cellT.alignment = {
          horizontal: 'center',
          vertical: 'middle', // Use 'middle' instead of 'center'
          wrapText: true
        };
        // Paint weekends and Hollidays
        for (let j = 6; j < totalRow; j++) {
          const rowW = worksheet?.getRow(j);
          if (!rowW) continue; // Skip if rowW is not valid

          for (let i = 0; i < collumnHeaders.length; i++) {

            const column = collumnHeaders[i][0];
            const type = collumnHeaders[i][1];

            const cellW = rowW.getCell(column);
            if (!cellW) continue;

            if (type === 1) {
              // Set background color for type 1
              cellW.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffbcb8b1' },
              };
            } else if (type === 2) {
              // Set background color for type 2
              cellW.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffc26c18' },
              };
            }
          }
        }
        collumnHeaders = [];
      }


      //   for (i = startRowPessoas; i < rowCountPessoas + startRowPessoas; i++) {
      //   headersF.forEach((header, index) => {
      //     worksheet.getCell(5, index + 1).value = header;
      //   });
      //   // Auto-fit columns
      //   worksheet.columns.forEach((column, columnIndex) => {
      //     if (column && column.header) {
      //       column.width = column.header.length < 10 ? 10 : column.header.length;
      //     }
      //   });
      // }

    }
    // // Function to convert a numerical index to a corresponding Excel column letter
    function getExcelColumnLetter(index) {
      let letter = "";
      while (index >= 0) {
        letter = String.fromCharCode(65 + (index % 26)) + letter;
        index = Math.floor(index / 26) - 1;
      }
      return letter;
    }


    if (monthCheck !== 11) {
      excelFilePath += "ferias" + tipoName + monthNames[monthCheck] + year + ".xlsx"
    } else {
      excelFilePath += "ferias" + tipoName + year + ".xlsx"
    }

    // Save the workbook
    await workbook.xlsx.writeFile(excelFilePath)
      .then(() => {
        console.log("Exported" + excelFilePath);
        ret = excelFilePath;
      })
      .catch((error) => {
        console.log("Error" + excelFilePath);
        ret = false;
      });


    excelFilePath = process.env.EXTRACTION_FOLDER_FERIAS;
  } catch (error) {
    console.error("Error Export Horas", error);
    ret = false;
  }
  return ret;
}

module.exports = {
  exportExcell,
};
