import * as React from "react";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";

export default function CancelModel({
  open,
  handleOpen,
  handleClose,
  actionCancel,
  deleteMessage,
}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h3"> {"Cancel confirmation ?"}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonBox>
            <Button onClick={handleClose} variant="contained">
              Cancel
            </Button>
            <Button onClick={actionCancel} autoFocus variant="contained">
              Ok
            </Button>
          </ButtonBox>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
const ButtonBox = styled.div`
  ${({ theme }) => `
    display: flex;
    
    justify-content: space-between;
     padding: ${theme.spacing(2)};
     gap: 15px;
  `}
`;
