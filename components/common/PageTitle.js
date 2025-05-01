import * as React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import SafeImage from './SafeImage';

const PageTitle = ({ subtitle, title, images_icon }) => {
  return (
    <Container>
      <Left>
        <Logo>
          <SafeImage src={images_icon} alt="image icon" width={40} height={40} />
        </Logo>
      </Left>
      <Right>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h2">{subtitle}</Typography>
      </Right>
    </Container>
  );
};
export default PageTitle;
const Container = styled.div`
  ${({ theme }) => `
    padding: 0;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      padding: ${theme.spacing(0, 0, 1, 0)};
    }
  `}
`;
const Right = styled.div`
  ${({ theme }) => `
    width: 100%;

    h2 {
      font-size: 20px;

      @media (min-width: ${theme.breakpoints.values.md}px) {
        font-size: 32px;
        font-weight: 700;
        color: ${theme.colors.palette.dGray};
      }
    }

    h6 {
      color: ${theme.colors.palette.mediumGrey};
      font-size: 16px;

      @media (min-width: ${theme.breakpoints.values.md}px) {
        font-size: 18px;
        color: ${theme.colors.palette.dGray};
      }
    }
  `}
`;
const Logo = styled.div`
  position: relative;
  top: 5px;

  img {
    width: 100%;
  }
`;
const Left = styled.div`
  ${({ theme }) => `
    width: 40px;
    flex: 0 0 40px;
    margin-right: 10px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      width: 60px;
      flex: 0 0 60px;
    }
  `}
`;
