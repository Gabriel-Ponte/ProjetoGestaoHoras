import React, { useCallback } from 'react';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
// import { DateTimePicker } from '@mui/x-date-pickers';
// import { DigitalClock } from '@mui/x-date-pickers';
// import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
// import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TimePickerClock = ({ projectID, ttID, projectNome, selectedTime, convertToInt }) => {
  console.log("TESTE")
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
      // onChange(e) // Pass the event object as needed
    }, [convertToInt, projectID, ttID, projectNome]);

  return (
    <DesktopTimePicker 
      size="medium"
      value={new Date(`2023-01-01T${selectedTime}:00`)}
      onChange={memoizedConvertToInt}
      // shouldDisableTime={(timeValue) => {
      //   const minutes = timeValue.getMinutes();
      //   return ![0, 15, 30, 45].includes(minutes);
      // }}

      timeSteps={{ minutes: 15 }}
      ampm={false}
    />
  );
};


export default React.memo(TimePickerClock);
