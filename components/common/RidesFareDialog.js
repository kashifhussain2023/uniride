import styled from "@emotion/styled";
import {
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RidesFareDialog = ({
  doubleClickDialogOpen,
  handleClose,
  ridesFareData,
}) => {
  return (
    <RideDialog
      open={doubleClickDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <List>
          <ListItem>
            <PriceBlock>
              <Typography>Base fare</Typography>
              <Typography>${ridesFareData?.base_fare}</Typography>
            </PriceBlock>
            <PriceBlock>
              <Typography>Minimum fare</Typography>
              <Typography>${ridesFareData?.minimum_fare}</Typography>
            </PriceBlock>
          </ListItem>
          <ListItem>
            <PriceBlock>
              <Typography> Per Mile fare</Typography>
              <Typography>${ridesFareData?.per_mile_fare}</Typography>
            </PriceBlock>
            <PriceBlock>
              <Typography>Per Min. fare</Typography>
              <Typography>${ridesFareData?.per_minute_fare}</Typography>
            </PriceBlock>
          </ListItem>
        </List>
      </DialogContent>
      <IconButton onClick={handleClose} autoFocus>
        <CloseIcon fontSize="small" />
      </IconButton>
    </RideDialog>
  );
};

export default RidesFareDialog;

const RideDialog = styled(Dialog)`
  ${({ theme }) => `
    &.MuiDialog-root {
      .MuiModal-backdrop {
        background-color: ${theme.colors.palette.black}33;
      }

      .MuiDialogContent-root {
        padding: ${theme.spacing(4, 4)};
      }

      .MuiIconButton-root {
        position: absolute;
        top: 0;
        right: 0;
      }

      .MuiList-root {
        padding: 0;
        border: 1px solid ${theme.colors.palette.black}33;
        border-radius: 10px;

        .MuiListItem-root {
          padding: 0;

          &:not(:last-child) {
            border-bottom: 1px solid ${theme.colors.palette.black}33;
          }
        }
      }
    }
  `}
`;

const PriceBlock = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(1, 2)};
    min-width: 160px;
    text-align: center;
    position: relative;
    
    .MuiTypography-root {
      font-weight: 500;
    }

    &:not(:last-child):after {
      content: "";
      position: absolute;
      top: 8px;
      bottom: 8px;
      background: ${theme.colors.palette.black}33;
      width: 1px;
      right: 0;
    }
  `}
`;
