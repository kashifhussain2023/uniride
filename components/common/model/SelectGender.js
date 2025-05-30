import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Radio, Typography } from '@mui/material';
const SelectGender = ({ open, handleGenderClose, proceedGenderModel }) => {
  const [checked, setChecked] = React.useState('male');
  
  const handleToggle = value => () => {
    setChecked(value);
  };
  const handleSelectGender = () => {
    try {
      // Call proceedGenderModel and handle the result properly
      proceedGenderModel(checked);

      // Only call .then() if result is a Promise
      // if (result && typeof result.then === 'function') {
      //   result
      //     .then(() => {
      //       // Handle success if needed
      //     })
      //     .catch(error => {
      //       console.error('Error in proceedGenderModel:', error);
      //     });
      // }
    } catch (error) {
      console.error('Error in handleSelectGender:', error);
    }
  };
  const handleClose = () => {
    handleGenderClose();
  };
  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" open={open} fullWidth maxWidth="md">
      <DialogContent>
        <LeftSection>
          <Typography variant="subtitle2">Select</Typography>
          <Typography
            variant="h2"
            sx={{
              mt: 0,
            }}
          >
            preferred gender of driver
          </Typography>
          <img src="../selctpreferred.png" />
        </LeftSection>
        <RightSection>
          <List>
            <ListItem>
              <ListItemButton onClick={handleToggle('male')}>
                <Radio checked={checked === 'male'} value={'male'} />

                <ListItemText primary={`Male `} />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={handleToggle('female')}>
                <Radio checked={checked === 'female'} value={'female'} />

                <ListItemText primary={`Female `} />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={handleToggle('any')}>
                <Radio checked={checked === 'any'} value={'any'} />

                <ListItemText primary={`Any `} />
              </ListItemButton>
            </ListItem>
          </List>
          <ButtonBox>
            <Button variant="secondary" fullWidth onClick={handleClose}>
              Close
            </Button>
            <Button variant="contained" fullWidth onClick={handleSelectGender}>
              Proceed
            </Button>
          </ButtonBox>
        </RightSection>
      </DialogContent>
    </BootstrapDialog>
  );
};
export default SelectGender;
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
const LeftSection = styled('div')`
  ${({ theme }) => `
    width: 50%;
    display: none;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: block;
    }

    h2 {
      font-weight: 700;
      font-size: 32px;
    }
  `}
`;
const RightSection = styled('div')`
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
const ButtonBox = styled('div')`
  ${({ theme }) => `
    display: flex;
    border-top: 1px solid ${theme.colors.palette.grey};
    justify-content: space-between;
     padding: ${theme.spacing(2, 3)};
     gap: 15px;
  `}
`;
