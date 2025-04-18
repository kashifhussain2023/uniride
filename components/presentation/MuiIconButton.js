import styled from "@emotion/styled";
import { IconButton as MuiIcon } from "@mui/material";

export default function MuiIconButton({ children, color }) {
  return <IconButton color={color}>{children}</IconButton>;
}

const IconButton = styled(MuiIcon)`
  ${({ theme, color }) => `
    width: 28px;
    height: 28px;
    background: ${theme.colors.palette[color]};
    border-radius: 4px;

    &:hover,
    &:active,
    &:focus {
      background: ${theme.colors.palette[color]};
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }

    .MuiSvgIcon-root {
      color: ${theme.colors.palette.white};
      font-size: 20px;
    }
  `}
`;
