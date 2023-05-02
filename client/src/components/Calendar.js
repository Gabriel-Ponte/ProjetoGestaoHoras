import React, { useState } from "react";
import Wrapper from "../assets/wrappers/Calendar";
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';

const CalendarControl = ({ handleChange }) =>{
    const [calendar, setCalendar] = useState(new Date());
    const [prevMonthLastDate, setPrevMonthLastDate] = useState(null);
    const calWeekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"];
    const calMonthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const localDate = new Date();


    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function firstDay() {
        return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
    }

    function lastDay() {
        return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
    }

    function firstDayNumber() {
        return firstDay().getDay() + 1;
    }

    function lastDayNumber() {
        return lastDay().getDay() + 1;
    }

    function getPreviousMonthLastDate() {
        return new Date(calendar.getFullYear(), calendar.getMonth(), 0).getDate();
    }

    function navigateToPreviousMonth() {
        handleChange(0, calendar.getMonth()-1, calendar.getFullYear());
        setCalendar(new Date(calendar.getFullYear(), calendar.getMonth() - 1, 1));

        attachEventsOnNextPrev();
    }

    function navigateToNextMonth() {
        handleChange(0, calendar.getMonth()+1, calendar.getFullYear());
        setCalendar(new Date(calendar.getFullYear(), calendar.getMonth() + 1, 1));

        attachEventsOnNextPrev();
    }

    function navigateToCurrentMonth() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        handleChange(0, currentMonth, currentYear);
        setCalendar(new Date(currentYear, currentMonth, 1));
        attachEventsOnNextPrev();
    }

    function displayYear() {
        const yearLabel = document.querySelector(".calendar .calendar-year-label");
        yearLabel.innerHTML = calendar.getFullYear();
    }

    function displayMonth() {
        const monthLabel = document.querySelector(".calendar .calendar-month-label");
        monthLabel.innerHTML = calMonthName[calendar.getMonth()];
    }

    function selectDate(e) {
        console.log(e.target.textContent)
        handleChange(e.target.textContent ,calendar.getMonth(),calendar.getFullYear());
    }

    function plotDayNames() {
        const calendarBody = document.querySelector(".calendar .calendar-body");
        for (let i = 0; i < calWeekDays.length; i++) {
            const day = document.createElement("div");
            day.textContent = calWeekDays[i];
            calendarBody.appendChild(day);
        }
    }

    function plotDates() {
        const calendarBody = document.querySelector(".calendar .calendar-body");
        if (!calendarBody) {
            console.log("Could not find calendar body element.");
            return;
        }
        calendarBody.innerHTML = "";
        plotDayNames();
        displayMonth();
        displayYear();
        let count = 1;
        let prevDateCount = 0;
    
        const prevMonthLastDate = getPreviousMonthLastDate();
        let prevMonthDatesArray = [];
        const calendarDays = daysInMonth(
            calendar.getMonth() + 1,
            calendar.getFullYear()
        );
    
        // plot dates of previous month
        for (let i = 1; i < firstDayNumber(); i++) {
            const prevDate = prevMonthLastDate - (firstDayNumber() - i) + 1;
            const prevDateHTML = `<div class="prev-dates">${prevDate}</div>`;
            calendarBody.insertAdjacentHTML("beforeend", prevDateHTML);
            prevMonthDatesArray.push(prevDate);
            prevDateCount++;
        }
        // plot dates of current month
        for (let i = 1; i <= calendarDays; i++) {
            const dateHTML = `<div class="number-item" data-num="${count}"><a class="dateNumber" href="#">${i}</a></div>`;
            calendarBody.insertAdjacentHTML("beforeend", dateHTML);
            count++;
        }
    
        // plot dates of next month to fill remaining days
        const nextMonthFirstDay = (firstDayNumber() + calendarDays - 1) % 7;
        for (let i = nextMonthFirstDay + 1; i <= 6; i++) {
            const nextDate = i - nextMonthFirstDay;
            const nextDateHTML = `<div class="next-dates">${nextDate}</div>`;
            calendarBody.insertAdjacentHTML("beforeend", nextDateHTML);
        }
    
        highlightToday();
        plotPrevMonthDates(prevMonthDatesArray);
        plotNextMonthDates();
        attachEvents();
    }

    function attachEvents() {
        let prevBtn = document.querySelector(".calendar .calendar-prev a");
        let nextBtn = document.querySelector(".calendar .calendar-next a");
        let todayDate = document.querySelector(".calendar .calendar-today-date");
        let dateNumber = document.querySelectorAll(".calendar .dateNumber");
        prevBtn.addEventListener(
            "click",
            navigateToPreviousMonth
        );
        nextBtn.addEventListener("click", navigateToNextMonth);
        todayDate.addEventListener(
            "click",
            navigateToCurrentMonth
        );
        for (var i = 0; i < dateNumber.length; i++) {
            dateNumber[i].addEventListener(
                "click",
                selectDate,
                false
            );
        }
    }
    function highlightToday() {
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

    function plotPrevMonthDates(dates) {

        //dates.reverse();
        for (let i = 0; i < dates.length; i++) {
            if (document.querySelectorAll(".prev-dates")) {
                document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
            }
        }
    }


    function plotNextMonthDates() {
        let lastDay = lastDayNumber();
        if (lastDay !== 7) {
            for (let i = 1; i <= 7 - lastDay; i++) {
                document.querySelector(
                    ".calendar .calendar-body"
                ).innerHTML += `<div class="next-dates"></div>`;
            }
        }
    }


    function loopThroughNextDays(count) {
        if (count > 0) {
            for (let i = 1; i <= count; i++) {
                document.querySelector('.calendar-body').innerHTML += `<div class="next-dates">${i}</div>`;
            }
        }
    }

    function attachEventsOnNextPrev() {
        highlightToday();
        let dateNumber = document.querySelectorAll(".calendar .dateNumber");
        for (var i = 0; i < dateNumber.length; i++) {
            dateNumber[i].addEventListener(
                "click",
                selectDate,
                false
            );
        }
    }

    //attachEventsOnNextPrev();
    plotDates();


    return (
        <Wrapper>
            <div className="calendar">
                <div className="calendar-inner">
                    <div className="calendar-controls">
                        <div className="calendar-prev">
                            <a href="#">
                                <MdKeyboardArrowLeft width="128" height="128" />
                            </a>
                        </div>
                        <div className="calendar-year-month">
                            <div className="calendar-month-label">
                            </div>
                            <div>-</div>
                            <div className="calendar-year-label">
                              
                            </div>
                        </div>
                        <div className="calendar-next">
                            <a href="#">
                                <MdKeyboardArrowRight width="128" height="128" />
                            </a>
                        </div>
                    </div>


                <div className="calendar-today-date"> 
                {calWeekDays[localDate.getDay()]} {localDate.getDate()} {calMonthName[localDate.getMonth()]}  {localDate.getFullYear()}
                </div>
                <div className="calendar-body">
                </div>
            </div>                
            </div>
        </Wrapper>
    );

}

export default CalendarControl;