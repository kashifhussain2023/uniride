import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

export default function MapView({ centerMapLocation, mapContainerStyle }) {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={centerMapLocation}
        zoom={15}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
        }}
      >
        {centerMapLocation && <MarkerF position={centerMapLocation} />}
      </GoogleMap>
    </LoadScript>
  );
}
