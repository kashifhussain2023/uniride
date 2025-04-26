import { TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';

// Client-side only date picker wrapper
const DatePickerWrapper = ({ label, value, onChange, minDate, maxDate, format }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <TextField label={label} fullWidth />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        renderInput={props => <TextField {...props} />}
        minDate={minDate}
        maxDate={maxDate}
        format={format}
      />
    </LocalizationProvider>
  );
};

// Client-side only time picker wrapper
const TimePickerWrapper = ({ label, value, onChange, shouldDisableTime, onError }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <TextField label={label} fullWidth />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        renderInput={props => <TextField {...props} />}
        shouldDisableTime={shouldDisableTime}
        onError={onError}
      />
    </LocalizationProvider>
  );
};

export { DatePickerWrapper, TimePickerWrapper };
