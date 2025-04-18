import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ModuleCard from '../components/presentation/ModuleCard';

export default function Test2() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
    
      <ModuleCard
        open={openDialog}
        handleClickOpen={handleOpenDialog}
        handleClose={handleCloseDialog}
      />
    </>
  );
}