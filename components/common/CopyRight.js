import * as React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export default function CopyRight() {
  return (
    <Container>
      <Typography>Uniride ©2024 All rights reserved</Typography>
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
    bottom: 0;
    background: ${theme.colors.palette.cream};

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding: ${theme.spacing(3, 4)};
    }
  `}
`;
