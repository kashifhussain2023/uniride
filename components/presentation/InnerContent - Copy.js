import React from "react";
import styled from "@emotion/styled";

export default function InnerContent({ children }) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(2)};
    height: auto;
    overflow: auto;

    @media (min-width: ${theme.breakpoints.values.md}px) {           
      height: calc(100vh - 243px);  
      padding: ${theme.spacing(4)};    
    }

    @media (min-width: ${theme.breakpoints.values.lg}px) {           
      height: calc(100vh - 259px);    
    }

    .MuiGrid-root {
      overflow: hidden;
    }
 `}
`;
