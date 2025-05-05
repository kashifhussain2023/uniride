import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import ConfirmBooking from './ConfirmBooking';
import InRoute from './InRoute';
import SelectRide from './SelectRide';
import SelectGender from './model/SelectGender';

// Dynamically import AddDesignated to avoid SSR issues
const AddDesignated = dynamic(() => import('./AddDesignated'), { ssr: false });

export default function RiderInfo({
  carsList,
  currentLocation,
  handleSelectRide,
  setCustomerRideType,
  handleComfirmBooking,
  proceedGenderModel,
  _handleInRoute,
  selectRide,
  comfirmBooking,
  inRoute,
  genderModelOpen,
  handleCancelModelInfo,
  comfirmBookingData,
  acceptDriverDetail,
  applyCoupon,
  userAuth,
  rideStatus,
  isAddDesignated,
  saveDateTime,
  setSaveDateTime,
  handleCancelRunningRide,
  handleCarTypeId,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  scheduleRideStatus,
  carStatus,
  carTypeId,
  setCarTypeId,
  handleGenderClose,
  setAvgTime,
  avgTime,
  setAvailableDriver,
  setCouponActive,
  setCouponCode,
  setPromotionId,
  distance,
  duration,
}) {
  return (
    <LeftPannel>
      <AddDesignated
        rideStatus={rideStatus}
        saveDateTime={saveDateTime}
        setSaveDateTime={setSaveDateTime}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        scheduleRideStatus={scheduleRideStatus}
      />
      {selectRide ? (
          <SelectRide
            carsList={carsList}
            handleSelectRide={handleSelectRide}
            setCustomerRideType={setCustomerRideType}
            handleCarTypeId={handleCarTypeId}
            carTypeId={carTypeId}
            setCarTypeId={setCarTypeId}
            isAddDesignated={isAddDesignated}
            carStatus={carStatus}
            setAvgTime={setAvgTime}
            setAvailableDriver={setAvailableDriver}
            distance={distance}
            duration={duration}
          />
      ) : comfirmBooking ? (
        <>
          <ConfirmBooking
            currentLocation={currentLocation}
            handleComfirmBooking={handleComfirmBooking}
            comfirmBookingData={comfirmBookingData}
            applyCoupon={applyCoupon}
            isAddDesignated={isAddDesignated}
            avgTime={avgTime}
            userAuth={userAuth}
            setPromotionId={setPromotionId}
            setCouponCode={setCouponCode}
            setCouponActive={setCouponActive}
          />
          <SelectGender
            open={genderModelOpen}
            proceedGenderModel={proceedGenderModel}
            handleGenderClose={handleGenderClose}
          />
        </>
      ) : inRoute ? (
        // Render something for inRoute case
          <InRoute
            handleCancelModelInfo={handleCancelModelInfo}
            handleCancelRunningRide={handleCancelRunningRide}
            acceptDriverDetail={acceptDriverDetail}
            userAuth={userAuth}
            rideStatus={rideStatus}
          />
      ) : (
        ''
      )}
    </LeftPannel>
  );
}
const LeftPannel = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    width: 100%;
    flex: 0 0 100%;
    margin-bottom: 15px;
    position: relative;
    margin-right: calc(${theme.spacing(2)} + 14px);
    border-radius: 16px;
    padding: ${theme.spacing(2)};
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    max-height: calc(100vh - 200px);
    overflow: auto;

   
    @media (min-width: ${theme.breakpoints.values.md}px) {
      width: 386px;
      flex: 0 0 386px;
      margin-bottom: 0px;
      border-radius: 16px 0px 16px 16px;
    }
    .MuiTableCell-root {
      h4 {
        font-size: 16px;
      }
    }
  `}
`;
