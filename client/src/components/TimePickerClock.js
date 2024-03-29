import React, { useCallback, useMemo } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const MemoizedDesktopTimePicker = React.memo(TimePicker);

const TimePickerClock = React.memo(({ name, projectID, ttID, projectNome, selectedTime, convertToInt }) => {
  // Memoize the convertToInt function
  const memoizedConvertToInt = useCallback((newTime) => {
    const hours = newTime.getHours();
    let minutes = newTime.getMinutes();

    // Round minutes to the nearest 15
    minutes = Math.round(minutes / 15) * 15;

    // Ensure minutes are within the valid range (0-59)
    minutes = Math.min(45, Math.max(0, minutes));

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    convertToInt(projectID, ttID, projectNome, formattedTime);
  }, [convertToInt, projectID, ttID, projectNome]);

  // Memoize the formattedTimeValue
  const formattedTimeValue = useMemo(() => new Date(`2023-01-01T${selectedTime}:00`), [selectedTime]);

  return (
    <div className="row mb-3 text-center">
      <div className="col-md-9 text-start themed-grid-col" >
        <p>{name}</p>
      </div>
      <div className="col-md-3 themed-grid-col">
        <MemoizedDesktopTimePicker
          value={formattedTimeValue}
          onChange={memoizedConvertToInt}
          timeSteps={{ minutes: 15 }}
          ampm={false}
        />
      </div>
    </div>
  );
});

export default TimePickerClock;
