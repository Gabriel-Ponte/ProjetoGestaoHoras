import styled from 'styled-components'

const Wrapper = styled.section`
:root {
    --calendar-bg-color: #262829;
    --calendar-font-color: #FFF;
    --weekdays-border-bottom-color: #404040;
    --calendar-date-hover-color: #505050;
    --calendar-current-date-color: #1b1f21;
    --calendar-today-color: linear-gradient(to bottom, #03a9f4, #2196f3);
    --calendar-today-innerborder-color: transparent;
    --calendar-nextprev-bg-color: transparent;
    --next-prev-arrow-color : #FFF;
    --calendar-border-radius: 16px;
    --calendar-prevnext-date-color: #484848
}

* {
    padding: 0;
    margin: 0;
}

.calendar {
    font-family: 'IBM Plex Sans', sans-serif;
    position: relative;
    width: auto; /*change as per your design need */
    min-width: 320px;
    background: var(--calendar-bg-color);
    color: var(--calendar-font-color);
    margin: 20px auto;
    box-sizing: border-box;
    overflow: hidden;
    font-weight: normal;
    border-radius: var(--calendar-border-radius);
}



.calendar .calendar-inner .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
}
@media (max-width: 750px) {
.calendar-inner {
    padding: 10px 10px;
    width:100%;
}

.calendar .calendar-inner .calendar-body div:nth-child(-n+7) {
    border: 1px solid transparent;
    border-bottom: 1px solid var(--weekdays-border-bottom-color);
    font-size:2vw;
}
.calendar .calendar-inner .calendar-body div {
    padding: 0.2vw;
    min-height: 2vw;
    min-width: 1vw;
    line-height: 3vw;
    border: 1px solid transparent;
    margin: 10px 2px 0px;
}

.calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-year-label,
.calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-month-label {
    font-weight: 500;
    font-size: 4vw;
}
}
@media (min-width: 750px) {
    .calendar-inner {
        padding: 10vw 10vw;
        padding-top: 0;
        padding-bottom: 0;
        width:100%;
    }
    .calendar .calendar-inner .calendar-body div {
        padding: 1vw;
        min-height: 1vw;
        min-width: 1vw;
        max-width: 10vw;
        line-height: 0.5vw;
        border: 1px solid transparent;
        margin: 10px 2px 0px;
    }

    .calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-year-label,
.calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-month-label {
    font-weight: 500;
    font-size: 3vw;
}
.calendar .calendar-inner .calendar-body div:nth-child(-n+7) {
    border: 1px solid transparent;
    border-bottom: 1px solid var(--weekdays-border-bottom-color);
    font-size:2vw;
}
    }

    @media (min-width: 1300px) {
        .calendar-inner {
            padding: 10vw 10vw;
            padding-top: 0;
            padding-bottom: 0;
            width:100%;
        }
        .calendar .calendar-inner .calendar-body div {
            padding: 1vw;
            min-height: 1vw;
            min-width: 1vw;
            max-width: 10vw;
            line-height: 0.5vw;
            border: 1px solid transparent;
            margin: 10px 2px 0px;
        }
    
        .calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-year-label,
    .calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-month-label {
        font-weight: 500;
        font-size: 1.5vw;
    }
    .calendar .calendar-inner .calendar-body div:nth-child(-n+7) {
        text-align:start;
        border-bottom: 1px solid var(--weekdays-border-bottom-color);
        font-size:0.8vw;
        margin:auto;
    }
    }


.calendar .calendar-inner .calendar-body div:nth-child(-n+7):hover {
    border: 1px solid transparent;
    border-bottom: 1px solid var(--weekdays-border-bottom-color);
    cursor: default;
}

.calendar .calendar-inner .calendar-body div>a {
    color: var(--calendar-font-color);
    text-decoration: none;
    display: flex;
    justify-content: center;
}

.calendar .calendar-inner .calendar-body div:hover {
    border: 1px solid var(--calendar-date-hover-color);
    cursor: pointer;
}

.calendar .calendar-inner .calendar-body div.empty-dates:hover {
    border: 1px solid transparent;
}

.calendar .calendar-inner .calendar-controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

.calendar .calendar-inner .calendar-today-date {
    display: grid;
    text-align: center;
    cursor: pointer;
    margin: 3px 0px;
    background: var(--calendar-current-date-color);
    padding: 8px 0px;
    border-radius: 10px;
    width: 80%;
    margin: auto;
}

.calendar .calendar-inner .calendar-controls .calendar-year-month {
    display: flex;
    min-width: 10px;
    justify-content: space-evenly;
    align-items: center;
}

.calendar .calendar-inner .calendar-controls .calendar-next {
    text-align: right;
}


.calendar .calendar-inner .calendar-body .calendar-today:hover {
    border: 1px solid transparent;
}
.calendar .calendar-inner .calendar-body .calendar-fimSemana {
    background: #BCB8B1;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-today {
    color: blue;
    border-radius: 4px;
}


.calendar .calendar-inner .calendar-body .calendar-today a {
    outline: 2px solid var(--calendar-today-innerborder-color);
}

.calendar .calendar-inner .calendar-body .calendar-inserted {
    background: #588157;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-projeto {
    background: #898121;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-feriado {
    background: #c26c18;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-inicio {
    background: #588157;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-fim {
    background: #588157;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-objetivo {
    background: #81171B;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-notFound {
    background: #81171B;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-inserted-low {
    background: #DDDF00;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-inserted-high {
    background: #1A4301;
    border-radius: 4px;
}
.calendar .calendar-inner .calendar-controls .calendar-next a,
.calendar .calendar-inner .calendar-controls .calendar-prev a {
    color: var(--calendar-font-color);
    font-family: arial, consolas, sans-serif;
    font-size: 1vw;
    text-decoration: none;
    padding: 4px 12px;
    display: inline-block;
    background: var(--calendar-nextprev-bg-color);
    margin: 10px 0 10px 0;
}

.calendar .calendar-inner .calendar-controls .calendar-next a svg,
.calendar .calendar-inner .calendar-controls .calendar-prev a svg {
    height: 20px;
    width: 20px;
}

.calendar .calendar-inner .calendar-controls .calendar-next a svg path,
.calendar .calendar-inner .calendar-controls .calendar-prev a svg path{

}

.calendar .calendar-inner .calendar-body .prev-dates,
.calendar .calendar-inner .calendar-body .next-dates {
    color: var(--calendar-prevnext-date-color);
}

.calendar .calendar-inner .calendar-body .prev-dates:hover,
.calendar .calendar-inner .calendar-body .next-dates:hover {
  border: 1px solid transparent;
  pointer-events: none;
}
`
export default Wrapper

//fill: var(--next-prev-arrow-color);