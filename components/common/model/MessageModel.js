import styled from "@emotion/styled";
import { Button, Dialog, TextField, Typography } from "@mui/material";

const MessageModel = ({ handleAction, open, close, message, showPasswordField = false,
  password = "",
  onPasswordChange = () => {}, }) => (
  <Dialog open={open} size="sm" onClose={close}>
    <Body>
      <Typography variant="h3">{message}</Typography>
      {showPasswordField && (
        <PasswordField
          type="password"
          label="Enter your password"
          fullWidth
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          variant="outlined"
        />
      )}
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

const PasswordField = styled(TextField)`
  margin-top: 1.5rem;
`;