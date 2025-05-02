import * as React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
export default function PageTitle({ children, subtitle, title }) {
  return (
    <Container>
      <Left>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="h6">{subtitle}</Typography>
      </Left>
      <Right>{children}</Right>
    </Container>
  );
}
const Container = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(2)};
    border-bottom: 1px solid ${theme.colors.palette.lightGrey};
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    @media (min-width: ${theme.breakpoints.values.md}px) {           
      padding: ${theme.spacing(2, 4)}; 
    }   
  `}
`;
const Left = styled.div`
  ${({ theme }) => `
    h2 {
      font-size: 18px;

      @media (min-width: ${theme.breakpoints.values.md}px) {  
        font-size: 24px;
      }
    }

    h6 {
      color:  ${theme.colors.palette.mediumGrey};
      font-size: 14px;

      @media (min-width: ${theme.breakpoints.values.md}px) {  
        font-size: 16px;
      }
    }
  `}
`;
const Right = styled.div``;
