import { useMemo } from 'react';
import i18n from '@/i18n';

// This module exports a hook plus a plain function (`getFeriadosPortugalDate`) that is
// called from render code outside of a component's hook scope, so it cannot use
// `useTranslation`. Holidays are therefore stored with a stable `nameKey` and translated
// on demand through the shared i18n instance, which keeps the returned value a ready-to-
// display string for every existing caller.
const holidayName = (nameKey) => i18n.t(`dias:holidays.${nameKey}`);


const useFeriadosPortugal = () => {
    const feriadosPortugal = useMemo(() => {
      return (date) => {
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
    }, []); // Empty dependency array means it will only be created once
  
    return { feriadosPortugal };
  };  


const holidayCache = {};

const getHolidaysForYear = (year) => {
  if (holidayCache[year]) {
    return holidayCache[year];
  }

  const holidays = [];

  for (let i = year - 5; i < year + 5; i++) {
    holidays.push(
      { nameKey: "anoNovo", date: new Date(i, 0, 1) },
      { nameKey: "diaLiberdade", date: new Date(i, 3, 25) },
      { nameKey: "diaTrabalhador", date: new Date(i, 4, 1) },
      { nameKey: "diaPortugal", date: new Date(i, 5, 10) },
      { nameKey: "assuncaoNossaSenhora", date: new Date(i, 7, 15) },
      { nameKey: "feriasColetivas", date: new Date(2024, 7, 16) },
      { nameKey: "implantacaoRepublica", date: new Date(i, 9, 5) },
      { nameKey: "diaTodosSantos", date: new Date(i, 10, 1) },
      { nameKey: "restauracaoIndependencia", date: new Date(i, 11, 1) },
      { nameKey: "diaImaculadaConceicao", date: new Date(i, 11, 8) },
      { nameKey: "feriadoMunicipal", date: new Date(i, 2, 12) },
      { nameKey: "feriasColetivas", date: new Date(i, 11, 24) },
      { nameKey: "natal", date: new Date(i, 11, 25) },
      { nameKey: "feriasColetivas", date: new Date(i, 11, 26) },
      { nameKey: "carnaval", date: calculateEaster(i, "Carnaval") },
      { nameKey: "sextaFeiraSanta", date: calculateEaster(i, "SextaFeiraSanta") },
      { nameKey: "pascoa", date: calculateEaster(i, "DomingoPascoa") },
      { nameKey: "segundaFeiraPascoa", date: new Date(2023, 3, 10) }, //{ nameKey: "segundaFeiraPascoa", date: calculateEaster(i, "SegundaPascoa") },
      { nameKey: "corpoDeus", date: calculateCorpusChristi(i) },
      );
  }

  holidayCache[year] = holidays;
  return holidays;
};


export function getFeriadosPortugalDate(date) {

  const feriados = [];

  for (let i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
    feriados.push(
      { nameKey: "anoNovo", date: new Date(i, 0, 1) },
      { nameKey: "diaLiberdade", date: new Date(i, 3, 25) },
      { nameKey: "diaTrabalhador", date: new Date(i, 4, 1) },
      { nameKey: "diaPortugal", date: new Date(i, 5, 10) },
      { nameKey: "assuncaoNossaSenhora", date: new Date(i, 7, 15) },
      { nameKey: "feriasColetivas", date: new Date(2024, 7, 16) },
      { nameKey: "implantacaoRepublica", date: new Date(i, 9, 5) },
      { nameKey: "diaTodosSantos", date: new Date(i, 10, 1) },
      { nameKey: "restauracaoIndependencia", date: new Date(i, 11, 1) },
      { nameKey: "diaImaculadaConceicao", date: new Date(i, 11, 8) },
      { nameKey: "feriadoMunicipal", date: new Date(i, 2, 12) },
      { nameKey: "feriasColetivas", date: new Date(2024, 11, 24) },
      { nameKey: "natal", date: new Date(i, 11, 25) },
      { nameKey: "feriasColetivas", date: new Date(2024, 11, 26) },
      { nameKey: "feriasColetivas", date: new Date(2023, 11, 26) },
      { nameKey: "feriasColetivas", date: new Date(2024, 11, 31) },
      { nameKey: "carnaval", date: calculateEaster(i, "Carnaval") },
      { nameKey: "sextaFeiraSanta", date: calculateEaster(i, "SextaFeiraSanta") },
      { nameKey: "pascoa", date: calculateEaster(i, "DomingoPascoa") },
      { nameKey: "segundaFeiraPascoa", date: new Date(2023, 3, 10) }, //{ nameKey: "segundaFeiraPascoa", date: calculateEaster(i, "SegundaPascoa") },
      { nameKey: "corpoDeus", date: calculateCorpusChristi(i) },
    );
  }

  for (const feriado of feriados) {
    if (
      date.getDate() === feriado.date.getDate() &&
      date.getMonth() === feriado.date.getMonth() &&
      date.getFullYear() === feriado.date.getFullYear()
    ) {
      return feriado?.nameKey ? holidayName(feriado.nameKey) : false;
    }
  }
  return false;
}


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


export default useFeriadosPortugal ;
