const MarkerF = ({ label }) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Your custom marker content */}
      <div
        style={{
          backgroundColor: 'red',
          borderRadius: '50%',
          color: 'white',
          padding: '5px',
        }}
      >
        {label}
      </div>
    </div>
  );
};
export default MarkerF;
