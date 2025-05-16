import styled from '@emotion/styled';
import PageTitle from '@/components/common/PageTitle';
import RidesTabs from './RidesTabs';
export default function SelectRide({
  carsList,
  handleSelectRide,
  setCustomerRideType,
  isAddDesignated,
  handleCarTypeId,
  saveDateTime,
  carStatus,
  carTypeId,
  setCarTypeId,
  setAvgTime,
  setAvailableDriver,
  distance,
  duration,
}) {
  return (
    <>
      <PageTitle
        title="Book Your"
        subtitle="Rides"
        images_icon={`${process.env.NEXTAUTH_URL}/icon1.png`}
        isAddDesignated={isAddDesignated}
      />
      {isAddDesignated && (
        <DesignatedBar>Select the car type you want to designated driver for</DesignatedBar>
      )}
      <RidesTabs
        carsList={carsList}
        handleSelectRide={handleSelectRide}
        setCustomerRideType={setCustomerRideType}
        saveDateTime={saveDateTime}
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
    </>
  );
}
const DesignatedBar = styled.div`
  ${({ theme }) => `
    padding:10px;
    text-align:center;
    font-size:14px;
    border-radius:5px;
    margin-bottom:10px;
    color: ${theme.colors.palette.white};
    background: ${theme.colors.palette.orange};
    
  `}
`;
