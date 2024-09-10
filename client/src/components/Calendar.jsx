import { useCallback, useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/Calendar";
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { toast } from 'react-toastify';
import useFeriadosPortugal from "./FeriadosPortugal";
import PropTypes from 'prop-types'; 

const CalendarControl = ({ handleChange, inserted, feriados, ferias,inserting, compensacao, compensacaoDomingo, inicio, fim, objetivo,aceitacao, vProjeto, todos, numberUsers, horasExtraID, selectedDate , user}) => {
    const [calendar, setCalendar] = useState(selectedDate ? new Date(selectedDate.ano , selectedDate.mes , 1 ,0 , 0, 0) : new Date());

    const calWeekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const calMonthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const { feriadosPortugal } = useFeriadosPortugal();
    const localDate = new Date();
    

    // useEffect(() => {
    //     plotDates(calendar);     
    // }, []);

    // useEffect(() => {
    //     displayMonth();
    //     displayYear();
    // }, [calendar, inicio, vProjeto]);

    
    useEffect(() => {
        initializeCalendar();
      },  [selectedDate, ferias?.length, inicio,inserting, vProjeto, user]);


      const initializeCalendar = useCallback(() => {
        if(selectedDate && ((selectedDate.mes !== calendar.getMonth()) || (selectedDate.ano !== calendar.getFullYear()))) {
            const date = selectedDate ? new Date(selectedDate.ano , selectedDate.mes , 1 ,0 , 0, 0) : new Date();
            setCalendar(date);
            plotDates(date);
        } else{
            plotDates(calendar);
        }

        const date = selectedDate ? new Date(selectedDate.ano , selectedDate.mes , 1 ,0 , 0, 0) : new Date();
        
        // setCalendar(date);
        displayMonth(date.getMonth());
        displayYear(date.getFullYear());

    }, [selectedDate, inicio, vProjeto, inserting, user, ferias?.length]);

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function firstDay(calendar) {

        return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
    }

    // function lastDay(calendar) {
    //     return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
    // }

    function firstDayNumber(calendar) {
        return firstDay(calendar).getDay();
    }

    // function lastDayNumber(calendar) {
    //     return lastDay(calendar).getDay();
    // }

    function getPreviousMonthLastDate(calendar) {
        return new Date(calendar.getFullYear(), calendar.getMonth(), 0).getDate();
    }

    async function navigateToPreviousMonth() {

            let newCalendar;
            if (calendar.getMonth() === 0) {
                // Handle December (month number 11)
                newCalendar = new Date(calendar.getFullYear() - 1, 11, 1);
            } else {
                newCalendar = new Date(calendar.getFullYear(), calendar.getMonth() - 1, 1);
            }
    
            handleChange(0, newCalendar.getMonth(), newCalendar.getFullYear());
    
            // Plot the new dates
            plotDates(newCalendar);
    
            setCalendar(newCalendar);
    }

    function navigateToNextMonth() {
            let newCalendar;
            if (calendar.getMonth() === 11) {
                // Handle December (month number 11)
                handleChange(0, 0, calendar.getFullYear() + 1);
                newCalendar = new Date(calendar.getFullYear() + 1, 0, 1);
            } else {
                handleChange(0, calendar.getMonth() + 1, calendar.getFullYear());
                newCalendar = new Date(calendar.getFullYear(), calendar.getMonth() + 1, 1);
            }
    
            plotDates(newCalendar);
            setCalendar(newCalendar);
    }

    function navigateToCurrentMonth() {
        let newCalendar;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        handleChange(0, currentMonth, currentYear);
        newCalendar = new Date(currentYear, currentMonth, 1);

        plotDates(newCalendar);
        setCalendar(newCalendar);
}

    function displayYear(ano) {
        const yearLabel = document.querySelector(".calendar .calendar-year-label");
        yearLabel.textContent = ano;
    }

    function displayMonth(month) {
        const monthLabel = document.querySelector(".calendar .calendar-month-label");
        monthLabel.textContent = calMonthName[month];
    }

    function selectDate(e) {
        let newCalendar;
        setCalendar((calendar) => {
            handleChange(e.target.textContent, calendar.getMonth(), calendar.getFullYear());
            newCalendar = new Date(calendar.getFullYear(), calendar.getMonth());
            plotDates(newCalendar);
            return newCalendar;
        });
        //handleChange(e.target.textContent, calendar.getMonth(), calendar.getFullYear());
    }

    function plotDayNames() {
        const calendarBody = document.querySelector(".calendar .calendar-body");
        for (let i = 0; i < calWeekDays.length; i++) {
            const day = document.createElement("div");

            day.textContent = calWeekDays[i];
            calendarBody.appendChild(day);
        }
    }

    function plotDates(calendar) {
        const calendarBody = document.querySelector(".calendar .calendar-body");
        if (!calendarBody) {
            return;
        }
        calendarBody.innerHTML = "";
        plotDayNames();
        let count = 1;
        //let prevDateCount = 0;

        const prevMonthLastDate = getPreviousMonthLastDate(calendar);
        let prevMonthDatesArray = [];

        const calendarDays = daysInMonth(calendar.getMonth() + 1, calendar.getFullYear());

        // plot dates of previous month
        for (let i = 1; i < firstDayNumber(calendar) + 1; i++) {
            const prevDate = prevMonthLastDate - (firstDayNumber(calendar) - i);
            const prevDateHTML = `<div class="prev-dates">${prevDate}</div>`;
            calendarBody.insertAdjacentHTML("beforeend", prevDateHTML);
            prevMonthDatesArray.push(prevDate);
            //prevDateCount++;
        }

        // plot dates of current month
        for (let i = 1; i <= calendarDays; i++) {
            const dateHTML = `<div class="number-item" data-num="${count}"><a class="dateNumber" >${i}</a></div>`;
            calendarBody.insertAdjacentHTML("beforeend", dateHTML);
            count++;
        }
        highlightToday(calendar);
        highlightInsertedDays(calendar);
        // plot dates of next month to fill remaining days
        const nextMonthFirstDay = (firstDayNumber(calendar) + calendarDays - 1) % 7;
        for (let i = nextMonthFirstDay + 1; i <= 6; i++) {
            const nextDate = i - nextMonthFirstDay;
            const nextDateHTML = `<div class="next-dates">${nextDate}</div>`;
            calendarBody.insertAdjacentHTML("beforeend", nextDateHTML);
        }

        //plotPrevMonthDates(prevMonthDatesArray);
        //plotNextMonthDates();

        attachEvents();
    }

    // function plotPrevMonthDates(dates) {
    //     const prevDates = document.querySelectorAll(".prev-dates");
    //     for (let i = 0; i < prevDates.length; i++) {
    //         prevDates[i].textContent = dates[i];
    //     }
    // }

    // function plotNextMonthDates() {
    //     const lastDay = lastDayNumber(calendar);
    //     if (lastDay !== 6) {
    //         for (let i = 1; i <= 6 - lastDay; i++) {
    //             document.querySelector(".calendar .calendar-body").innerHTML += `<div class="next-dates">${i}</div>`;
    //         }
    //     }
    // }

    function highlightToday(calendar) {
        let currentMonth = localDate.getMonth() + 1;
        let changedMonth = calendar.getMonth() + 1;
        let currentYear = localDate.getFullYear();
        let changedYear = calendar.getFullYear();
        let numberItems = document.querySelectorAll(".number-item");
        if (
            currentYear === changedYear &&
            currentMonth === changedMonth &&
            numberItems !== null &&
            numberItems.length >= calendar.getDate()
        ) {
            numberItems[localDate.getDate() - 1].classList.add("calendar-today");
        }
    }

    function highlightInsertedDays(calendar) {
        const numberItems = document.querySelectorAll(".number-item");
        const changedMonth = calendar.getMonth() + 1;
        const changedYear = calendar.getFullYear();
        let dias = [];


        const filteredInserted = inserted?.filter(item => {
            return (
                new Date(item.Data)?.getMonth() === calendar.getMonth() &&
                new Date(item.Data)?.getFullYear() === changedYear
            );
        });

        const filteredVProjeto = vProjeto?.filter(item => {
            return (
                new Date(item.Data)?.getMonth() === calendar.getMonth() &&
                new Date(item.Data)?.getFullYear() === changedYear
            );
        });

        if (todos && todos === true) {
            
            if (filteredInserted) {
                const filteredDias = inserted.filter((dia) => (new Date(dia.Data).getMonth() + 1) === changedMonth && new Date(dia.Data).getFullYear() === changedYear);

                let arrayDates = {};

                for (let i = 0; i < filteredDias.length; i++) {
                    let nHours = parseFloat(filteredDias[i].NumeroHoras) || 0;
                    for (let j = 0; j < filteredDias[i].tipoDeTrabalhoHoras.length; j++) {
                        const projeto = filteredDias[i].tipoDeTrabalhoHoras[j]
                        const tt = projeto.tipoTrabalho.split(',') || [];
                        const ttH = projeto.horas.split(',') || [];

                        for (let h = 0; h < tt.length; h++) {
                            if (tt[h] === horasExtraID) {
                                nHours -= parseFloat(ttH[h]);
                            }
                        }
                    }
                    if (!arrayDates[filteredDias[i].Data]) {
                        arrayDates[filteredDias[i].Data] = nHours;
                    } else {
                        arrayDates[filteredDias[i].Data] += nHours;
                    }
                }


                for (let date in arrayDates) {

                    const insertedDay = new Date(date);

                    if (
                        numberItems !== null &&
                        numberItems.length >= insertedDay.getDate()
                    ) {

                        if (feriadosPortugal(insertedDay)) {
                            numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                        } else if (insertedDay.getDay() === 5) {
                            const possibleHours = numberUsers * 6;
                            if (arrayDates[date] < possibleHours) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-low");
                            } else if (arrayDates[date] > possibleHours) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                            } else {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted");
                            }
                        } else if (insertedDay.getDay() === 0 || insertedDay.getDay() === 6) {
                            if (arrayDates[date] > 0) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                            }
                        } else {
                            const possibleHours = numberUsers * 8.5;
                            if (arrayDates[date] < possibleHours) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-low");
                            } else if (arrayDates[date] > possibleHours) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                            } else {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted");
                            }
                        }
                    }
                }
            }
            if (feriados) {
                for (let i = 0; i < feriados.length; i++) {
                    const insertedDay = new Date(feriados[i].date);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();

                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-feriado");
                    }
                }
            }
            const daysInMonth = new Date(changedYear, changedMonth, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(changedYear, changedMonth - 1, day);
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    numberItems[day - 1].classList.add("calendar-fimSemana");
                }
            }
        } else {

            if (filteredInserted) {
                for (let i = 0; i < filteredInserted.length; i++) {
                    const insertedDay = new Date(filteredInserted[i]?.Data);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    let numberHours = filteredInserted[i].NumeroHoras;
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {

                        for (let h = 0; h < filteredInserted[i].tipoDeTrabalhoHoras.length; h++) {
                            const projeto = filteredInserted[i].tipoDeTrabalhoHoras[h]
                            const tt = projeto.tipoTrabalho.split(',') || [];
                            const ttH = projeto.horas.split(',') || [];

                            for (let j = 0; j < tt.length; j++) {
                                if (tt[j] === horasExtraID) {
                                    numberHours -= parseFloat(ttH[j]);
                                }
                            }
                        }

                        dias.push(insertedDay);
                        if (feriadosPortugal(insertedDay)) {
                            numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                        } else if (insertedDay.getDay() === 5) {
                            if (numberHours < 6) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-low");
                            } else if (numberHours > 6) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                            } else {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted");
                            }
                        } else if (insertedDay.getDay() === 0 || insertedDay.getDay() === 6) {
                            numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                        } else {
                            if (numberHours < 8.5) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-low");
                            } else if (numberHours > 8.5) {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                            } else {
                                numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted");
                            }
                        }
                    }
                }
            }


            if (feriados) {
                for (let i = 0; i < feriados.length; i++) {
                    const insertedDay = new Date(feriados[i].date);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();

                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-feriado");
                    }
                }
            }

            if (ferias) {
                for (let i = 0; i < ferias.length; i++) {
                    const insertedDay = new Date(ferias[i].Data);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-ferias");
                    }
                }
            }
            if (inserting) {
                for (let i = 0; i < inserting.length; i++) {
          
                    const insertedDay = new Date(inserting[i]);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserting");
                    }
                }
            }
            

            if(compensacao){
                for (let i = 0; i < compensacao.length; i++) {
                    const insertedDay = new Date(compensacao[i].Data);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-compensacao");
                    }
                }
            }

            if(compensacaoDomingo){
                for (let i = 0; i < compensacaoDomingo.length; i++) {
                    const insertedDay = new Date(compensacaoDomingo[i].Data);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-compensacaoDomingo");
                    }
                }
            }

            

            if(aceitacao){
                for (let i = 0; i < aceitacao.length; i++) {
                    const insertedDay = new Date(aceitacao[i].Data);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();

                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-aceitacao");
                    }
                }
            }

            if (inicio) {
                try {
                    const insertedDay = new Date(inicio);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-inicio");
                    }
                } catch {
                    toast.error("Inicio não é uma data")
                }
            }

            if (objetivo) {
                try {
                    const insertedDay = new Date(objetivo);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-objetivo");
                    }
                } catch {
                    toast.log("Objetivo não é uma data")
                }
            }

            if (fim) {
                try {
                    const insertedDay = new Date(fim);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();
                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-fim");
                    }
                } catch {
                    toast.log("Fim não é uma data")
                }
            }

            if (filteredVProjeto) {
                for (let i = 0; i < filteredVProjeto.length; i++) {
                    const insertedDay = new Date(filteredVProjeto[i].Data);
                    const currentMonth = insertedDay?.getMonth() + 1;
                    const currentYear = insertedDay?.getFullYear();

                    if (
                        currentYear === changedYear &&
                        currentMonth === changedMonth &&
                        numberItems !== null &&
                        numberItems.length >= calendar.getDate()
                    ) {
                        dias.push(insertedDay);
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-projeto");
                    }
                }
            }

            

            const daysInMonth = new Date(changedYear, changedMonth, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(changedYear, changedMonth - 1, day);
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    numberItems[day - 1].classList.add("calendar-fimSemana");
                }
            }
        }
    }



    function attachEvents() {
        // let todayDate = document.querySelector(".calendar .calendar-today-date");
        let dateNumber = document.querySelectorAll(".calendar .number-item");

        // todayDate.addEventListener("click", navigateToCurrentMonth);
        for (var i = 0; i < dateNumber.length; i++) {
            dateNumber[i].addEventListener("click", selectDate, false);
        }
    }

    return (
        <Wrapper>
            <div className="calendar">
                <div className="calendar-inner">
                    <div className="calendar-controls">
                        <div className="calendar-prev text-end">
                            <button className=".calendar .calendar-prev"  onClick={() => navigateToPreviousMonth()}>
                                <MdKeyboardArrowLeft width="128" height="128" />
                            </button>
                        </div>
                        <div className="calendar-year-month">
                            <div className="calendar-month-label"></div>
                            <div>-</div>
                            <div className="calendar-year-label"></div>
                        </div>
                        <div className="calendar-next text-start">
                            <button className=".calendar .calendar-next a" onClick={navigateToNextMonth}>
                                <MdKeyboardArrowRight width="128" height="128" />
                            </button>
                        </div>
                    </div>
                    <div className="calendar-today-date"  onClick={navigateToCurrentMonth}>
                        {calWeekDays[localDate.getDay()]} {localDate.getDate()} {calMonthName[localDate.getMonth()]} {localDate.getFullYear()}
                    </div>
                    <div className="calendar-body"></div>
                </div>
            </div>
        </Wrapper>
    );
};

CalendarControl.propTypes = {
    handleChange: PropTypes.func.isRequired, 
    inserted: PropTypes.array, 
    feriados: PropTypes.array.isRequired, 
    ferias: PropTypes.array, 
    inserting: PropTypes.array,
    compensacao: PropTypes.array, 
    compensacaoDomingo: PropTypes.array, 
    inicio: PropTypes.string, 
    fim: PropTypes.string, 
    objetivo: PropTypes.string,
    aceitacao: PropTypes.array, 
    vProjeto: PropTypes.array, 
    todos: PropTypes.bool, 
    numberUsers: PropTypes.number, 
    horasExtraID: PropTypes.string, 
    selectedDate: PropTypes.object, 
  }

export default CalendarControl;
