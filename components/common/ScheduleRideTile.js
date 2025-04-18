import styled from "@emotion/styled";
import { Button, Dialog, List, ListItem, Typography } from "@mui/material";

const ScheduleRideTile = ({
  content,
  cancelSchedule,
  open,
  areYouSure,
  close,
}) => (
  <Container>
    <ScheduleList disablePadding>
      <ListItem disableGutters>
        <Typography component="span">Start Point: </Typography>
        {content.customer_pick_up_point_name}
      </ListItem>
      <ListItem disableGutters>
        <Typography component="span">End Point: </Typography>
        {content.customer_destination_point_name}
      </ListItem>
      <ListItem disableGutters>
        <Typography component="span">Date: </Typography>
        {content.schedule_request_date}
      </ListItem>
      <ListItem disableGutters>
        <Typography component="span">Time: </Typography>
        {content.schedule_request_time}
      </ListItem>
    </ScheduleList>
    <ActionContainer>
      <Button variant="contained" color="error" onClick={areYouSure}>
        Cancel Schedule
      </Button>
      <Dialog open={open} size="sm" onClose={close}>
        <Body>
          <Typography variant="h3">
            Are You sure want to cancel this schedule ?
          </Typography>
        </Body>
        <ButtonBox>
          <Button variant="secondary" onClick={close}>
            No
          </Button>
          <Button variant="contained" onClick={cancelSchedule}>
            Yes
          </Button>
        </ButtonBox>
      </Dialog>
    </ActionContainer>
  </Container>
);

export default ScheduleRideTile;

const Container = styled.div`
  ${({ theme }) => `
     border: 1px solid ${theme.colors.palette.grey};
     padding: ${theme.spacing(2, 3)};
     border-radius: 10px;
     height: 100%;
     display: flex;
     flex-direction: column;
   `}
`;

const ScheduleList = styled(List)`
  .MuiListItem-root {
    align-items: flex-start;

    > span {
      flex: 0 0 120px;
      font-weight: 500;
    }
  }
`;

const ActionContainer = styled.div`
  ${({ theme }) => `
    text-align: right;
    margin-top: auto;

    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiButton-root {
        width: 100%;
      }
    }
  `}
`;

const ButtonBox = styled.div`
  ${({ theme }) => `
    display: flex;
    border-top: 1px solid ${theme.colors.palette.grey};
    justify-content: space-between;
     padding: ${theme.spacing(2, 3)};
  `}
`;

const Body = styled.div`
  ${({ theme }) => `
    text-align: center;
    padding: ${theme.spacing(3)}
  `}
`;
