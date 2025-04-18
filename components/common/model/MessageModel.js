import styled from "@emotion/styled";
import { Button, Dialog, Typography } from "@mui/material";

const MessageModel = ({ handleAction, open, close, message }) => (
  <Dialog open={open} size="sm" onClose={close}>
    <Body>
      <Typography variant="h3">{message}</Typography>
    </Body>
    <ButtonBox>
      <Button variant="secondary" onClick={close}>
        No
      </Button>
      <Button variant="contained" onClick={handleAction}>
        Yes
      </Button>
    </ButtonBox>
  </Dialog>
);

export default MessageModel;

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
