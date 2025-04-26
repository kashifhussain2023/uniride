import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import Image from 'next/image';
import calendarIcon from '../../public/date.png';
export default function DatePicker() {
  return (
    <DatePickerComponent>
      <Image src={calendarIcon} alt="logo" priority />
      <TextField id="outlined-basic" label="Filter by Date" variant="outlined" type="date" />
    </DatePickerComponent>
  );
}
const DatePickerComponent = styled.div`
  ${({ theme }) => `
    background: ${theme.colors.palette.orange};
    border-radius: 21px;
    position: relative;

    > img {
      position: absolute;
      transform: translateY(-50%);
      top: 50%;
      right: 15px;
    }

    .MuiFormControl-root {
      height: 42px;
      border-radius: 21px;
      width: 180px;

    @media (min-width: ${theme.breakpoints.values.md}px) {     
      width: 200px;
    }

      .MuiFormLabel-root {
        transform: translate(20px, 10px) scale(1);
        color: ${theme.colors.palette.white};

        &.MuiInputLabel-shrink {
          transform: translate(20px, -18px) scale(0.7);
          font-size: 0px; 

          & + .MuiInputBase-root {
            color: ${theme.colors.palette.white};
          }
        }        
      }

      .MuiOutlinedInput-notchedOutline {
        border: 0;
      }

      .MuiInputBase-root {
        color: ${theme.colors.palette.orange}; 
        font-size: 14px;      

        &.Mui-focused {
          color: ${theme.colors.palette.white};        
        }

        input {
          height: 44px;
          padding: 0 20px;

          &::-webkit-calendar-picker-indicator {
            opacity: 0;
            width: 50px;
            height: 50px;
          }
        }
      }
    }
  `}
`;
