import styled from 'styled-components'

// NOTE: the calendar tokens live in index.css `:root`, where they are derived
// from the semantic tokens (--white, the --grey scale, the --primary scale), so
// the calendar follows the light/dark theme automatically.
//
// A `:root { ... }` block used to sit right here declaring those tokens. It
// never did anything: styled-components scopes it to `.thisComponent :root`, and
// :root is <html>, which can never be a descendant of this <section>. The real
// values always came from index.css. It has been removed.
const Wrapper = styled.section`
* {
    padding: 0;
    margin: 0;
}

.calendar {
    font-family: inherit;
    position: relative;
    width: auto; /*change as per your design need */
    min-width: 320px;
    background: var(--calendar-bg-color);
    color: var(--calendar-font-color);
    margin: 20px auto;
    box-sizing: border-box;
    overflow: hidden;
    font-weight: normal;
    border: 1px solid var(--calendar-border-color);
    border-radius: var(--calendar-border-radius);
    box-shadow: var(--shadow-1);
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
        font-size: 1.2vw;
    }
    .calendar .calendar-inner .calendar-body div:nth-child(-n+7) {
        text-align:start;
        border-bottom: 1px solid var(--weekdays-border-bottom-color);
        font-size:0.8vw;
        margin:auto;
    }
    }

/* Weekday header row (the first 7 cells). Declared AFTER the media queries so
   the typography wins on equal specificity, while they keep owning the sizing. */
.calendar .calendar-inner .calendar-body div:nth-child(-n+7) {
    color: var(--calendar-muted-color);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.calendar .calendar-inner .calendar-body div:nth-child(-n+7):hover {
    border: 1px solid transparent;
    border-bottom: 1px solid var(--weekdays-border-bottom-color);
    background: transparent;
    cursor: default;
}

/* Inherit (not the base font colour) so a status chip can set the day-number
   colour. Otherwise dark text would sit on the dark chips and be unreadable. */
.calendar .calendar-inner .calendar-body div>a {
    color: inherit;
    text-decoration: none;
    display: flex;
    justify-content: center;
}

.calendar .calendar-inner .calendar-body div {
    border-radius: 4px;
    transition: var(--transition);
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
    align-items: center;
}

.calendar .calendar-inner .calendar-today-date {
    display: grid;
    text-align: center;
    cursor: pointer;
    margin: 3px 0px;
    background: var(--calendar-current-date-color);
    color: var(--calendar-font-color);
    border: 1px solid var(--calendar-border-color);
    padding: 8px 0px;
    border-radius: 10px;
    width: 80%;
    margin: auto;
    transition: var(--transition);
}

.calendar .calendar-inner .calendar-today-date:hover {
    background: var(--calendar-date-hover-bg);
    border-color: var(--calendar-date-hover-color);
    color: var(--calendar-today-color);
}

.calendar .calendar-inner .calendar-controls .calendar-year-month {
    display: flex;
    min-width: 10px;
    justify-content: space-evenly;
    align-items: center;
    color: var(--calendar-font-color);
}

.calendar .calendar-inner .calendar-controls .calendar-next {
    text-align: right;
}


/* Today — brand accent (it used to be the hardcoded CSS keyword "blue"). A
   status chip declared below still wins the background, which is intended. */
.calendar .calendar-inner .calendar-body .calendar-today {
    color: var(--calendar-today-color);
    background: var(--calendar-today-bg);
    box-shadow: inset 0 0 0 1px var(--calendar-today-innerborder-color);
    font-weight: 700;
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-today:hover {
    border: 1px solid transparent;
}

.calendar .calendar-inner .calendar-body .calendar-today a {
    outline: none;
}

/* ---- Status chips -------------------------------------------------------
   The hues come from the --status-* tokens in index.css, which are THE single
   source of truth: the legend swatches in VisualizarHoras / VisualizarHorasProjetos
   / VisualizarProjeto read the very same tokens, so a legend can no longer drift
   from the calendar it explains. Tune a colour there, not here.
   The text colour is explicit and FIXED (--status-on-dark / --status-on-light)
   because the chip background is fixed: if the text flipped with the theme it
   would break contrast (e.g. dark text on the near-black "fim" chip). */
.calendar .calendar-inner .calendar-body .calendar-fimSemana {
    background: var(--status-weekend);
    color: var(--status-on-light);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-inserted {
    background: var(--status-hours);
    color: var(--status-on-dark);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-projeto {
    background: var(--status-project);
    color: var(--status-on-dark);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-feriado {
    background: var(--status-holiday);
    color: var(--status-on-dark);
    border-radius: 4px;
}


.calendar .calendar-inner .calendar-body .calendar-ferias {
    cursor: default;
    background: var(--status-vacation);
    color: var(--status-on-light);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-inserting {
    cursor: default;
    background: var(--status-vacation-pending);
    color: var(--status-on-light);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-compensacao {
    cursor: default;
    background: var(--status-compensation);
    color: var(--status-on-dark);
    border-radius: 4px;
}
.calendar .calendar-inner .calendar-body .calendar-compensacaoDomingo {
    cursor: default;
    background: var(--status-compensation-sunday);
    color: var(--status-on-light);
    border-radius: 4px;
}
.calendar .calendar-inner .calendar-body .calendar-inicio {
    background: var(--status-date-start);
    color: var(--status-on-dark);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-fim {
    background: var(--status-date-end);
    color: var(--status-on-dark);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-objetivo {
    background: var(--status-date-target);
    color: var(--status-on-dark);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-notFound {
    background: var(--status-not-found);
    color: var(--status-on-dark);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-inserted-low {
    background: var(--status-hours-low);
    color: var(--status-on-light);
    border-radius: 4px;
}

.calendar .calendar-inner .calendar-body .calendar-inserted-high {
    background: var(--status-hours-high);
    color: var(--status-on-dark);
    border-radius: 4px;
}


.calendar .calendar-inner .calendar-body .calendar-aceitacao {
    background: var(--status-approval);
    color: var(--status-on-light);
    border-radius: 4px;
}


.calendar .calendar-inner .calendar-controls .calendar-next button,
.calendar .calendar-inner .calendar-controls .calendar-prev button {
    color: var(--next-prev-arrow-color);
    font-family: inherit;
    font-size: 1vw;
    text-decoration: none;
    padding: 4px 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--calendar-nextprev-bg-color);
    margin: 10px 0 10px 0;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 999px;
    transition: var(--transition);
}

.calendar .calendar-inner .calendar-controls .calendar-next button:hover,
.calendar .calendar-inner .calendar-controls .calendar-prev button:hover {
    color: var(--calendar-today-color);
    background: var(--calendar-date-hover-bg);
    border-color: var(--calendar-date-hover-color);
}

.calendar .calendar-inner .calendar-controls .calendar-next button:focus-visible,
.calendar .calendar-inner .calendar-controls .calendar-prev button:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
}

.calendar .calendar-inner .calendar-controls .calendar-next button svg,
.calendar .calendar-inner .calendar-controls .calendar-prev button svg {
    height: 20px;
    width: 20px;
    fill: currentColor;
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
