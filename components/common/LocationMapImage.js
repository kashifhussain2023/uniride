import React from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const LocationMapImage = (props) => {
  const mapContainerStyle = {
    width: "100%",
    height: "150px", // Set a specific height
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
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {defaultCenter && <MarkerF position={defaultCenter} label="Location" />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMapImage;
