import styled from '@emotion/styled';
import { Select } from '@mui/material';
const MuiDatePicker = ({ renderDays, renderMonths, renderYears, handleDateChange, date }) => {
  const customMenuProps = {
    PaperProps: {
      className: 'custom-select-menu',
      style: {
        maxHeight: 360,
      },
    },
    anchorOrigin: {
      horizontal: 'left',
      vertical: 'bottom',
    },
    getcontentanchorel: null,
    transformOrigin: {
      horizontal: 'left',
      vertical: 'top',
    },
  };
  return (
    <Container>
      <Select
        labelId="date-days-select"
        id="date-days-select"
        value={date.day}
        onChange={handleDateChange}
        name="day"
        data-option="day"
        MenuProps={customMenuProps}
      >
        {renderDays()}
      </Select>
      <Select
        labelId="date-months-select"
        id="date-months-select"
        value={date.month}
        onChange={handleDateChange}
        name="month"
        data-option="month"
        MenuProps={customMenuProps}
      >
        {renderMonths()}
      </Select>
      <Select
        labelId="date-months-select"
        id="date-months-select"
        value={date.year}
        onChange={handleDateChange}
        name="year"
        data-option="year"
        MenuProps={customMenuProps}
      >
        {renderYears()}
      </Select>
    </Container>
  );
};
export default MuiDatePicker;
const Container = styled.div`
  ${({ theme }) => `
    border-radius: 4px;
    display: flex;
    position: relative;

    .MuiFormLabel-root {
      top: 0;
      left: 0;
      position: absolute;
      transform-origin: top left;
      transform: translate(9px, -10px) scale(0.75);
      z-index: 99;
      background: ${theme.colors.palette.white};

      .MuiTypography-root {
        color: ${theme.colors.palette.orange};
      }
    }

    .MuiInputBase-root {
      flex: 1;

      .MuiOutlinedInput-notchedOutline {
        border-color: ${theme.colors.palette.darkerGray};
      }

      &[data-option="year"],
      &[data-option="day"] {
        flex: 0 0 25%;
        max-width: 25%;
      }

      &[data-option="month"] {
        margin: 0 ${theme.spacing(2)};
      }

      .MuiSelect-select {
        padding-right: ${theme.spacing(4)};

        &:focus {
          background: transparent;
        }
      }

      .MuiSelect-icon {
        color: ${theme.colors.palette.darkGrey};
        right: ${theme.spacing(1)}px;
      }
    }
  `}
`;
