import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const ConfirmBooking = ({ open, handleClose }) => {
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <LeftSection>
          <Image
            src="/ConfirmBooking.png"
            alt="Confirm booking"
            width={24}
            height={24}
            className="mr-2"
          />
        </LeftSection>
        <RightSection>
          <List>
            <ListItem>
              <ListItemButton>
                <Checkbox />

                <ListItemText primary={`Favorite Location `} />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <Checkbox />

                <ListItemText primary={`New Location `} />
              </ListItemButton>
            </ListItem>
          </List>

          <Button variant="contained" fullWidth onClick={handleClose}>
            Cancel
          </Button>
        </RightSection>
      </DialogContent>
    </BootstrapDialog>
  );
};
export default ConfirmBooking;
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
