import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import CustomFormControl from "@/theme/CustomFormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle  from "@mui/material/DialogTitle";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AttachMoney } from "@mui/icons-material";

export default function TipAmountModel({
  open,
  handleClose,
  handleGetCustomTip,
}) {
  const [tipAmount, setTipAmount] = useState("");
  const [tipAmountError, setTipAmountError] = useState("");
  const [noError, setNoError] = useState(true);
  const handleInputChange = (event) => {
    const value = event.target.value;

    // Numeric validation
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      setTipAmountError("Please enter a valid tip amount.");
    } else {
      setTipAmountError("");
    }

    setTipAmount(value);
  };
  const sendTipAmount = () => {
    if (!tipAmount || tipAmount.trim() === "") {
      setTipAmountError("Please enter tip amount.");
    } else if (!/^\d+(\.\d{1,2})?$/.test(tipAmount)) {
      setTipAmountError("Please enter a valid tip amount.");
    } else {
      setTipAmountError("");
      handleClose();
      handleGetCustomTip(tipAmount);
      setTipAmount("");
    }
  };
  return (
    <AmountDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>TIP AMOUNT</DialogTitle>
      <DialogContent>
        <FormControl>
          <TextField
            fullWidth
            type="text"
            placeholder="Enter tip amount"
            value={tipAmount}
            name="tip_amount"
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )   
              
            }}
          />
          {tipAmountError && (
            <span style={{ color: "red" }}>{tipAmountError}</span>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button
          onClick={sendTipAmount}
          autoFocus
          variant="contained"
          color="error"
        >
          Ok
        </Button>
      </DialogActions>
    </AmountDialog>
  );
}

const AmountDialog = styled(Dialog)`
  .MuiDialog-paper {
    max-width: 400px;
    width: 100%;
  }
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
