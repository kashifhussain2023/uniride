import styled from '@emotion/styled';
import { Button, Dialog, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import { DatePickerWrapper, TimePickerWrapper } from './DatePickerWrapper';
import SafeImage from './SafeImage';

const AddDesignated = ({
  saveDateTime,
  setSaveDateTime,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  scheduleRideStatus,
}) => {
  const currentDate = new Date();
  const newDate = new Date(currentDate);
  const minutesToAdd = 15;

  // Add 10 minutes to the current time
  newDate.setMinutes(currentDate.getMinutes() + minutesToAdd);
  const [open, setOpen] = useState(false);
  const [openScheduleMsg, setOpenScheduleMsg] = useState(false);
  const [tempDate, setTempDate] = useState();
  const [tempTime, setTempTime] = useState();
  const [timeError, setTimeError] = useState(false);
  const handleOpen = () => {
    if (scheduleRideStatus) {
      setOpenScheduleMsg(true);
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const handleMessageClose = () => setOpenScheduleMsg(false);
  const handleSave = () => {
    if (timeError) {
      return;
    }
    setOpen(false);
    setSaveDateTime(true);
    setSelectedDate(tempDate || newDate);
    setSelectedTime(tempTime || newDate);
    //setTempDate(null);
    // if (selectedTime !== null && selectedDate !== null) {
    //   setSaveDateTime(true);
    // }
  };
  const handleCancel = () => {
    setOpen(false), setSaveDateTime(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };
  const handleTimeChange = time => {
    setTempTime(time);
    setTimeError(false);
  };
  const handleDateChange = date => {
    setTempDate(date);
    //set
  };
  const isTimeDisabled = time => {
    const currentTime = new Date();
    if (selectedDate || tempDate) {
      let selectedDateWithoutTime;
      if (tempDate) {
        selectedDateWithoutTime = new Date(
          tempDate.getFullYear(),
          tempDate.getMonth(),
          tempDate.getDate(),
          0,
          // Set hours to 0
          0,
          // Set minutes to 0
          0
        ); // Set seconds to 0
      } else {
        selectedDateWithoutTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          0,
          // Set hours to 0
          0,
          // Set minutes to 0
          0
        ); // Set seconds to 0
      }
      const currentTimeWithoutTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        0,
        // Set hours to 0
        0,
        // Set minutes to 0
        0
      ); // Set seconds to 0
      // const futureTime = new Date(selectedDateWithoutTime);
      // futureTime.setHours(time.getHours());
      // futureTime.setMinutes(time.getMinutes());

      const currentTimeCopy = new Date(currentTime);
      currentTimeCopy.setHours(time.getHours());
      currentTimeCopy.setMinutes(time.getMinutes());

      // const pastTime = new Date(currentTimeWithoutTime);
      // pastTime.setHours(time.getHours());
      // pastTime.setMinutes(time.getMinutes());

      if (selectedDateWithoutTime > currentTimeWithoutTime) {
        return currentTimeCopy > currentTime;
      } else {
        return currentTimeCopy < currentTime;
      }
    } else {
      const currentTimeCopy = new Date(currentTime);
      currentTimeCopy.setHours(time.getHours());
      currentTimeCopy.setMinutes(time.getMinutes());
      return currentTimeCopy < currentTime;
    }
  };
  return (
    <Container>
      {!saveDateTime ? (
        <>
          <IconButton onClick={handleOpen}>
            <SafeImage src="/date-time-icon.png" alt="Date and Time" width={30} height={30} />
          </IconButton>
        </>
      ) : (
        <SelectedDateTime onClick={handleOpen}>
          <Typography>{format(new Date(selectedDate || newDate), 'EEE MMM dd yyyy')}</Typography>
          <Typography> {format(new Date(selectedTime || newDate), 'hh:mm a')}</Typography>
        </SelectedDateTime>
      )}
      <Dialog open={open} onClose={handleClose}>
        <PopupBox>
          <FormContent>
            <InputBox>
              <DateBox>
                <DatePickerWrapper
                  label="Select Date"
                  value={tempDate || newDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  maxDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
                  format="MM/dd/yyyy"
                />
              </DateBox>
              <TimePickerWrapper
                label="Select Time"
                value={tempTime || newDate}
                onChange={handleTimeChange}
                shouldDisableTime={isTimeDisabled}
                onError={_err => setTimeError(true)}
              />
            </InputBox>
          </FormContent>
          <ButtonBox>
            <ResetButton>
              <Button variant="contained" onClick={handleCancel}>
                Reset
              </Button>
            </ResetButton>
            <OkButton>
              <Button variant="secondary" onClick={handleSave}>
                Ok
              </Button>
            </OkButton>
          </ButtonBox>
        </PopupBox>
      </Dialog>
      <Dialog open={openScheduleMsg} size="sm" onClose={handleMessageClose}>
        <Body>
          <Typography variant="h3">You have already booked a scheduled ride.</Typography>
        </Body>
        <ButtonBoxMessage>
          <Button variant="contained" onClick={handleMessageClose}>
            OK
          </Button>
        </ButtonBoxMessage>
      </Dialog>
    </Container>
  );
};

export default AddDesignated;

const Container = styled.div`
  ${({ theme }) => `
    text-align: right;
    flex: 0 0 120px;
    position: absolute;
    right: 16px;

    .MuiIconButton-root {
      color: ${theme.colors.palette.orange};
      img {
        width: 30px !important;
        height: 30px !important;
        object-fit: contain;
      }
    }
  `}
`;
const PopupBox = styled.div`
  width: 530px;
`;
const ButtonBoxMessage = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: center;  
    align-items: center;     
    border-top: 1px solid ${theme.colors.palette.grey};
    padding: ${theme.spacing(2, 3)};
  `}
`;
const ButtonBox = styled.div`
  ${({ theme }) => `
    display: flex;   
    border-top: 1px solid ${theme.colors.palette.grey};
    padding: ${theme.spacing(2, 3)};
  `}
`;
const ResetButton = styled.div`
  width: 300px;
`;
const OkButton = styled.div`
  width: 300px;
  text-align: right;
`;
const FormContent = styled.div`
  padding: 15px;
`;
const InputBox = styled.div`
  display: flex;
  padding: 5px;
`;
const DateBox = styled.div`
  display: flex;
  width: 250px;
`;
const SelectedDateTime = styled.div`
  cursor: pointer;
`;
const Body = styled.div`
  ${({ theme }) => `
    text-align: center;
    padding: ${theme.spacing(3)}
  `}
`;
