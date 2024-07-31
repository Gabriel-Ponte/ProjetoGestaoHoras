import { useCallback, useMemo, useState, memo, useEffect } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PropTypes from 'prop-types';
import Loading from './Loading';

const MemoizedTimePicker = memo(TimePicker);

const formatTime = (newTime) => {
  const hours = newTime.getHours();
  let minutes = newTime.getMinutes();

  // Round minutes to the nearest 15
  minutes = Math.round(minutes / 15) * 15;

  // Ensure minutes are within the valid range (0-59)
  minutes = Math.min(45, Math.max(0, minutes));

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const TimePickerClock = ({ disabled, name, projectID, ttID, projectNome, selectedTime, convertToInt, change }) => {
  const [formattedTimeValue, setFormattedTimeValue] = useState(null);
  useEffect(() => {
    if (selectedTime && selectedTime !== "00:00") {
      const date = new Date(`2023-01-01T${selectedTime}:00`);
      setFormattedTimeValue(date);

    } else {
      setFormattedTimeValue(null);
    }
  }, [selectedTime, change]);

  const memoizedConvertToInt = useCallback((newTime) => {
    if (newTime) {
      const formattedTime = formatTime(newTime);
      convertToInt(projectID, ttID, projectNome, formattedTime);
    }
  }, [convertToInt, projectID, ttID, projectNome]);



    return (
      <div key={ttID  + change} data-key={ttID} className="row mb-3 text-center">
        <div className="col-md-9 text-start themed-grid-col">
          <p>{name}</p>
        </div>
        <div className="col-md-3 themed-grid-col">
          <MemoizedTimePicker
            disabled={disabled}
            value={formattedTimeValue}
            onChange={memoizedConvertToInt}
            timeSteps={{ minutes: 15 }}
            ampm={false}
          />
        </div>
      </div>
    );
  }


TimePickerClock.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  projectID: PropTypes.string.isRequired,
  ttID: PropTypes.string.isRequired,
  projectNome: PropTypes.string.isRequired,
  selectedTime: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  convertToInt: PropTypes.func.isRequired,
  change: PropTypes.number.isRequired,
};

export default memo(TimePickerClock);
