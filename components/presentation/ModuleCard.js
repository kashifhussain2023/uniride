import React from 'react';
import Button from '@mui/material/Button';
//import AddLocation from '../common/model/AddLocation';
 //import ConfirmBooking from '../common/model/ConfirmBooking';
//import SelectGender from '../common/model/SelectGender';
import Delete from '../common/model/Delete'; 

export default function ModuleCard({ open, handleClickOpen, handleClose }) {
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button>
      {/* <AddLocation open={open} handleClose={handleClose} /> */}
      {/* <ConfirmBooking open={open} handleClose={handleClose} /> */}
      {/* <AddLocation open={open} handleClose={handleClose} /> */}
      <Delete open={open} handleClose={handleClose} />
    </React.Fragment>
  );
}

