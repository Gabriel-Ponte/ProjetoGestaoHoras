import React, { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/Calendar";
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
const CalendarControl = ({ handleChange, inserted, feriados, inicio, fim , objetivo, vProjeto }) => {
    const [calendar, setCalendar] = useState(new Date());
    const calWeekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const calMonthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const localDate = new Date();
    
    useEffect(() => {
        plotDates(calendar);
    }, [vProjeto]);

    useEffect(() => {
        displayMonth();
        displayYear();
    }, [calendar, vProjeto]);

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function firstDay(calendar) {

        return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
    }

    function lastDay(calendar) {
        return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
    }

    function firstDayNumber(calendar) {
        return firstDay(calendar).getDay();
    }

    function lastDayNumber(calendar) {
        return lastDay(calendar).getDay();
    }

    function getPreviousMonthLastDate(calendar) {
        return new Date(calendar.getFullYear(), calendar.getMonth(), 0).getDate();
    }

    function navigateToPreviousMonth() {

        setCalendar((prevCalendar) => {
            handleChange(0, prevCalendar.getMonth() - 1, prevCalendar.getFullYear());
            const newCalendar = new Date(prevCalendar.getFullYear(), prevCalendar.getMonth() - 1, 1);
            plotDates(newCalendar);
            return newCalendar;
        });

    }

    function navigateToNextMonth() {
        let newCalendar;
        setCalendar((prevCalendar) => {
            handleChange(0, prevCalendar.getMonth() + 1, prevCalendar.getFullYear());
            newCalendar = new Date(prevCalendar.getFullYear(), prevCalendar.getMonth() + 1, 1);
            plotDates(newCalendar);
            return newCalendar;
        });

    }

    function navigateToCurrentMonth() {
        let newCalendar;
        setCalendar((prevCalendar) => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            handleChange(0, currentMonth, currentYear);
            newCalendar = new Date(currentYear, currentMonth, 1);
            plotDates(newCalendar);
            return newCalendar;
        });
    }

    function displayYear() {
        const yearLabel = document.querySelector(".calendar .calendar-year-label");
        yearLabel.textContent = calendar.getFullYear();
    }

    function displayMonth() {
        const monthLabel = document.querySelector(".calendar .calendar-month-label");
        monthLabel.textContent = calMonthName[calendar.getMonth()];
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
            console.log("Não foi possivel carregar o calendário.");
            return;
        }
        calendarBody.innerHTML = "";
        plotDayNames();
        let count = 1;
        let prevDateCount = 0;

        const prevMonthLastDate = getPreviousMonthLastDate(calendar);
        let prevMonthDatesArray = [];

        const calendarDays = daysInMonth(calendar.getMonth() + 1, calendar.getFullYear());

        // plot dates of previous month
        for (let i = 1; i < firstDayNumber(calendar) + 1; i++) {
            const prevDate = prevMonthLastDate - (firstDayNumber(calendar) - i);
            const prevDateHTML = `<div class="prev-dates">${prevDate}</div>`;
            calendarBody.insertAdjacentHTML("beforeend", prevDateHTML);
            prevMonthDatesArray.push(prevDate);
            prevDateCount++;
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

    function plotPrevMonthDates(dates) {
        const prevDates = document.querySelectorAll(".prev-dates");
        for (let i = 0; i < prevDates.length; i++) {
            prevDates[i].textContent = dates[i];
        }
    }

    function plotNextMonthDates() {
        const lastDay = lastDayNumber(calendar);
        if (lastDay !== 6) {
            for (let i = 1; i <= 6 - lastDay; i++) {
                document.querySelector(".calendar .calendar-body").innerHTML += `<div class="next-dates">${i}</div>`;
            }
        }
    }

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
        if (inserted) {
            for (let i = 0; i < inserted.length; i++) {
                const insertedDay = new Date(inserted[i]?.Data);
                const currentMonth = insertedDay?.getMonth() + 1;
                const currentYear = insertedDay?.getFullYear();

                if (
                    currentYear === changedYear &&
                    currentMonth === changedMonth &&
                    numberItems !== null &&
                    numberItems.length >= calendar.getDate()
                ) {
                    dias.push(insertedDay);

                    if (inserted[i].NumeroHoras < 8) {
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-low");
                    } else if(inserted[i].NumeroHoras > 8){
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted-high");
                    } else{
                        numberItems[insertedDay.getDate() - 1].classList.add("calendar-inserted");
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

        if (inicio){
            try{
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
            }catch{
                console.log("Inicio não é uma data")
            }
        }

        if (objetivo){
            try{
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
            }catch{
                console.log("Objetivo não é uma data")
            }
        }

        if(fim){
            try{
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
            }catch{
                console.log("Fim não é uma data")
            }
        }

        if(vProjeto){
            for (let i = 0; i < vProjeto.length; i++) {
                const insertedDay = new Date(vProjeto[i].Data);
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



    function attachEvents() {
        let prevBtn = document.querySelector(".calendar .calendar-prev a");
        let nextBtn = document.querySelector(".calendar .calendar-next a");
        let todayDate = document.querySelector(".calendar .calendar-today-date");
        let dateNumber = document.querySelectorAll(".calendar .dateNumber");
        prevBtn.addEventListener("click", navigateToPreviousMonth);
        nextBtn.addEventListener("click", navigateToNextMonth);
        todayDate.addEventListener("click", navigateToCurrentMonth);
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
                            <a>
                                <MdKeyboardArrowLeft width="128" height="128" />
                            </a>
                        </div>
                        <div className="calendar-year-month">
                            <div className="calendar-month-label"></div>
                            <div>-</div>
                            <div className="calendar-year-label"></div>
                        </div>
                        <div className="calendar-next text-start">
                            <a>
                                <MdKeyboardArrowRight width="128" height="128" />
                            </a>
                        </div>
                    </div>
                    <div className="calendar-today-date">
                        {calWeekDays[localDate.getDay()]} {localDate.getDate()} {calMonthName[localDate.getMonth()]} {localDate.getFullYear()}
                    </div>
                    <div className="calendar-body"></div>
                </div>
            </div>
        </Wrapper>
    );
};

export default CalendarControl;
