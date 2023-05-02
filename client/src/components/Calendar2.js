import React, { useState } from "react";
import Wrapper from "../assets/wrappers/Calendar";

function CalendarControl() {
    const [calendar, setCalendar] = useState(new Date());
    const [prevMonthLastDate, setPrevMonthLastDate] = useState(null);

    const calWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calMonthName = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

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
        setCalendar(new Date(calendar.setMonth(calendar.getMonth() - 1)));
        attachEventsOnNextPrev();
    }

    function navigateToNextMonth() {
        setCalendar(new Date(calendar.setMonth(calendar.getMonth() + 1)));
        attachEventsOnNextPrev();
    }

    function navigateToCurrentMonth() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
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
        console.log(
            `${e.target.textContent} ${calMonthName[calendar.getMonth()]
            } ${calendar.getFullYear()}`
        );
    }

    function plotSelectors() {
        document.querySelector(".calendar").innerHTML +=
            <div class="calendar-inner">
                <div class="calendar-controls">
                    <div class="calendar-prev">
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
                                <path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z" />
                            </svg>
                        </a>
                    </div>
                    <div class="calendar-year-month">
                        <div class="calendar-month-label">
                        </div>
                        <div>-</div>
                        <div class="calendar-year-label">
                        </div>
                    </div>
                    <div class="calendar-next">
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
                                <path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="calendar-today-date"> Today: ${calWeekDays[localDate.getDay()]}, ${localDate.getDate()}, ${calMonthName[localDate.getMonth()]}
                    ${localDate.getFullYear()}
                </div>
                <div class="calendar-body">
                </div>
            </div>
    }

    function plotDayNames() {
        for (let i = 0; i < calWeekDays.length; i++) {
            document.querySelector(".calendar .calendar-body").innerHTML += <div>${calWeekDays[i]}</div>;
        }
    }


    function plotDates() {
        document.querySelector(".calendar .calendar-body").innerHTML = "";
        plotDayNames();
        displayMonth();
        displayYear();
        let count = 1;
        let prevDateCount = 0;

        prevMonthLastDate = getPreviousMonthLastDate();
        let prevMonthDatesArray = [];
        let calendarDays = daysInMonth(
            calendar.getMonth() + 1,
            calendar.getFullYear()
        );
        // dates of current month
        for (let i = 1; i < calendarDays; i++) {
            if (i < firstDayNumber()) {
                prevDateCount += 1;
                document.querySelector(
                    ".calendar .calendar-body"
                ).innerHTML += `<div class="prev-dates"></div>`;
                prevMonthDatesArray.push(prevMonthLastDate--);
            } else {
                document.querySelector(
                    ".calendar .calendar-body"
                ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
            }
        }
        //remaining dates after month dates
        for (let j = 0; j < prevDateCount + 1; j++) {
            document.querySelector(
                ".calendar .calendar-body"
            ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
        }
        highlightToday();
        plotPrevMonthDates(prevMonthDatesArray);
        plotNextMonthDates();
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
        if (
            currentYear === changedYear &&
            currentMonth === changedMonth &&
            document.querySelectorAll(".number-item")
        ) {
            document
                .querySelectorAll(".number-item")
            [calendar.getDate() - 1].classList.add("calendar-today");
        }
    }

    function plotPrevMonthDates(dates) {
        dates.reverse();
        for (let i = 0; i < dates.length; i++) {
            if (document.querySelectorAll(".prev-dates")) {
                document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
            }
        }
    }


    function plotNextMonthDates() {
        let childElemCount = document.querySelector('.calendar-body').childElementCount;
        //7 lines
        if (childElemCount > 42) {
            let diff = 49 - childElemCount;
            loopThroughNextDays(diff);
        }

        //6 lines
        if (childElemCount > 35 && childElemCount <= 42) {
            let diff = 42 - childElemCount;
            loopThroughNextDays(42 - childElemCount);
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
        plotDates();
        attachEvents();
    }
    function init() {
        plotSelectors();
        plotDates();
        attachEvents();
    }
}

export default CalendarControl;