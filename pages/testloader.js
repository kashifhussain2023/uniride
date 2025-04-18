
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styled from "@emotion/styled";

export default function SpinnerLoader({loading}) { 
  return (
    loading ? (
      <>
        <Container>
          <LoaderSpiring></LoaderSpiring>
        </Container>
      </>
    ) : (
      ''
    )
  );
}

const Container = styled.div` 
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  align-items: center;
  justify-content: center;
  z-index: 999
`

const LoaderSpiring = styled.div`
  ${({ theme }) => `
  position: relative; width: 100px; height: 100px; margin:0px auto; position:fixed; left:0px; right:0px;  z-index:999; background-color:#fff; background-image: url(../logo.jpg); background-repeat: no-repeat; border-radius:100%;
  background-position: center;  background-size: 68%;

  &::before{
    content: '';
  border-radius: 50%;
  position: absolute;
  inset: 0;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
  }

  &::after{
    content: '';
  border-radius: 50%;
  position: absolute;
  inset: 0;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
  box-shadow: 0 2px 0 #FF3D00 inset;
  animation: rotate 2s linear infinite; 
  }
  @keyframes rotate {
    0% {  transform: rotate(0)}
    100% { transform: rotate(360deg)}
  }
    
  `}
`;