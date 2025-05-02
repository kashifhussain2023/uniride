import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
const Delete = ({ open, handleClose, handleChangeOnDelete }) => {
  const handleDelete = () => {
    // Implement your delete logic here
    handleChangeOnDelete();
    handleClose();
  };
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle variant="h3">Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this payment card?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};
export default Delete;
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogContent-root': {
    alignItems: 'center',
    background: theme.colors.palette.lightGrey,
    borderRadius: 24,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  '& .MuiIconButton-root': {
    color: theme.colors.palette.black,
    fontSize: 30,
    right: -15,
    top: -25,
    zIndex: 999,
  },
  '& .MuiPaper-root': {
    borderRadius: 24,
    maxWidth: 750,
    padding: theme.spacing(1),
  },
}));
