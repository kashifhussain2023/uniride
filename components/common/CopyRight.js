import styled from '@emotion/styled';
import { Typography } from '@mui/material';
export default function CopyRight() {
  const year = new Date().getFullYear();
  return (
    <Container>
      <Typography>Uniride ©{year} All rights reserved</Typography>
    </Container>
  );
}
const Container = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(2, 4)};
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 3;
    bottom: 0;
    background: ${theme.colors.palette.cream};

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding: ${theme.spacing(3, 4)};
    }
  `}
`;
