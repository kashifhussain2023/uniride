import styled from '@emotion/styled';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import RidesCards from './RidesCards';
function RidesTabs(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 1,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}
RidesTabs.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    'aria-controls': `simple-tabpanel-${index}`,
    id: `simple-tab-${index}`,
  };
}
export default function BasicTabs({
  carsList,
  handleSelectRide,
  handleCarTypeId,
  isAddDesignated,
  carStatus,
  carTypeId,
  setCarTypeId,
  setAvgTime,
  setAvailableDriver,
  distance,
  duration,
}) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      {isAddDesignated ? (
        <>
          <RidesTabs value={value} index={0}>
            <RidesCards
              carsList={carsList}
              type="regular"
              handleCarTypeId={handleCarTypeId}
              carStatus={carStatus}
              setAvgTime={setAvgTime}
              setAvailableDriver={setAvailableDriver}
              distance={distance}
              duration={duration}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleSelectRide('regular')}
            >
              Ride Now
            </Button>
          </RidesTabs>
        </>
      ) : (
        <>
          <ChooseTab>
            <Box>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Regular" {...a11yProps(0)} />
                <Tab label="Corporate" {...a11yProps(1)} />
              </Tabs>
            </Box>
          </ChooseTab>
          <RidesTabs value={value} index={0}>
            <RidesCards
              type="regular"
              carsList={carsList}
              handleCarTypeId={handleCarTypeId}
              carStatus={carStatus}
              carTypeId={carTypeId}
              setCarTypeId={setCarTypeId}
              setAvgTime={setAvgTime}
              setAvailableDriver={setAvailableDriver}
              distance={distance}
              duration={duration}
            />
            <ButtonContainer>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleSelectRide('regular')}
              >
                Ride Now
              </Button>
            </ButtonContainer>
          </RidesTabs>
          <RidesTabs value={value} index={1}>
            <RidesCards
              type="corporate"
              carsList={carsList}
              handleCarTypeId={handleCarTypeId}
              carStatus={carStatus}
              carTypeId={carTypeId}
              setCarTypeId={setCarTypeId}
              setAvgTime={setAvgTime}
              setAvailableDriver={setAvailableDriver}
              distance={distance}
              duration={duration}
            />
            <ButtonContainer>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleSelectRide('corporate')}
              >
                Ride Now
              </Button>
            </ButtonContainer>
          </RidesTabs>
        </>
      )}
    </Box>
  );
}

const ChooseTab = styled.div`
  ${({ theme }) => `
    .MuiButtonBase-root {
      border-radius: 50px;
      border: 1px solid #dbdbdb;
      margin-right: 10px;
      min-height: 42px;
      text-transform: inherit;
      margin-top: 7px;
      margin-bottom: 7px;
      padding: 3px 26px !important;

      &.Mui-selected {
        background-color: #feae01;
        border: 1px solid ${theme.colors.palette.white};
        color: ${theme.colors.palette.white};
        box-shadow: 0px 0px 9px -1px rgba(0, 0, 0, 0.22);
      }

      .MuiBox-root {
        padding: 10px 0px !important;
      }
    }
    .MuiTabs-indicator {
      display: none !important;
    }
  `}
`;

const ButtonContainer = styled.div`
  ${({ theme }) => `
    position: sticky;
    bottom: -16px;
    padding: ${theme.spacing(2)};
    margin: -${theme.spacing(2)};
    margin-top: 0;
    background: ${theme.colors.palette.white};
  `}
`;
