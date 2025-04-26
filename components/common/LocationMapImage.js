import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
const LocationMapImage = props => {
  const mapContainerStyle = {
    height: '150px',
    // Set a specific height
    width: '100%',
  };
  const defaultCenter = {
    lat: parseFloat(props.locationLat) || 0,
    lng: parseFloat(props.locationLng) || 0,
  };
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={5}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
        }}
      >
        {defaultCenter && <MarkerF position={defaultCenter} label="Location" />}
      </GoogleMap>
    </LoadScript>
  );
};
export default LocationMapImage;
