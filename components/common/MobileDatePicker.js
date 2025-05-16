'use client';

import React from 'react';
import { TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function MobileDatesPicker(props) {
  const {
    label = '',
    name = '',
    value = null,
    onChange = () => {},
    error = false,
    helperText = '',
    fullWidth = true,
    disabled = false,
    minDate,
    maxDate = dayjs(),
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={newValue => onChange(newValue)}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        renderInput={params => (
          <TextField
            {...params}
            name={name}
            fullWidth={fullWidth}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </LocalizationProvider>
  );
}
