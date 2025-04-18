import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";

import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Delete = ({ open, handleClose, handleChangeOnDelete }) => {
  const [checked, setChecked] = React.useState([0]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
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
        <DialogContentText>
          Are you sure you want to delete this payment card?
        </DialogContentText>
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
  "& .MuiPaper-root": {
    maxWidth: 750,
    borderRadius: 24,
    padding: theme.spacing(1),
  },

  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    background: theme.colors.palette.lightGrey,
    borderRadius: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  "& .MuiIconButton-root": {
    right: -15,
    top: -25,
    color: theme.colors.palette.black,
    fontSize: 30,
    zIndex: 999,
  },

  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const LeftSection = styled("div")`
  ${({ theme }) => `
    width: 50%;
    display: none;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: block;
    }
  `}
`;
const RightSection = styled("div")`
  ${({ theme }) => `
  width:100%; background-color:#fff; border-radius:12px; padding:20px;
  @media (min-width: ${theme.breakpoints.values.md}px) {           
    width:50%;
  }
  

  .MuiList-root{ background-color:transparent; padding:0px;
    .MuiListItem-root{ padding:0px; border-bottom:1px solid ${theme.colors.palette.lightGrey}; 
&:last-child{ border-bottom:0px;}

}

.MuiButtonBase-root{ padding:10px 5px;
    &:hover{ background-color:transparent;}
    
    .Mui-checked{color:${theme.colors.palette.orange}}
    
    }

`}
`;

const FormControl = styled("div")`
  ${({ theme }) => `
    margin-bottom: 10px;
    .MuiInputBase-input {
      font-size: 16px;
      height: 30px;
      padding: 5px 10px;
      border-radius: 6px;
    }
    .MuiInputLabel-root {
      margin-top: 0px;
      display: block;
      margin-bottom: 5px;
      color: ${theme.colors.palette.darkGrey};
      span {
        color: ${theme.colors.palette.red};
      }
    }
  `}
`;
