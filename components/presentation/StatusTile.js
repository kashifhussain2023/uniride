import styled from '@emotion/styled';
import { IconButton, Typography } from '@mui/material';
import curveLine from '../../public/curve-line.png';
import Image from 'next/image';

export default function StatusTile({ bgColor, number, statusType, icon }) {
  return (
    <Container bgColor={bgColor}>
      <Status>
        <Typography variant="h1" component="div">
          {number}
        </Typography>
        <Typography component="h3">{statusType}</Typography>
      </Status>
      <MuiIconButton>
        <Image src={icon} alt="Status Icon" width={30} height={30} priority />
      </MuiIconButton>
      <CurveLine>
        <Image src={curveLine} alt="Curve Line" width={30} height={30} priority />
      </CurveLine>
    </Container>
  );
}
const Container = styled.div`
  ${({ theme, bgColor }) => `
    padding: ${theme.spacing(4, 3)};
    background: ${theme.colors.palette[bgColor]};
    border-radius: 10px;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-bottom: ${theme.spacing(2)};

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      min-height: 190px;
      padding: ${theme.spacing(4)};
    }

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      margin-bottom: ${theme.spacing(4)};
    }
  `}
`;
const CurveLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 15px;
`;
const Status = styled.div`
  ${({ theme }) => `
     .MuiTypography-root {
      color: ${theme.colors.palette.white}
     }

     h3.MuiTypography-root {
      color: ${theme.colors.palette.white}b3;
     }
  `}
`;
const MuiIconButton = styled(IconButton)`
  ${({ theme }) => `
    &.MuiIconButton-root {
      width: 75px;
      height: 75px;
      color: ${theme.colors.palette.white};
      background: ${theme.colors.palette.white}33; 
      margin-left: ${theme.spacing(2)};

      .MuiSvgIcon-root {
        font-size: 40px; 
      }  
    }
  `}
`;
