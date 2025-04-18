import React from 'react';

const MarkerF = ({ position, label }) => {
  return (
    <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
      {/* Your custom marker content */}
      <div style={{ backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '50%' }}>
        {label}
      </div>
    </div>
  );
};

export default MarkerF;