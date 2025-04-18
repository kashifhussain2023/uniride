import React, { useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { List, ListItem, Typography } from "@mui/material";

export default function ChartCard({ chart, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Container>
      <Header>
        <Typography variant="h2">{title}</Typography>
        <List variant="inline">
          <ListItem
            selected={selectedIndex === 0}
            onClick={(event) => handleClick(event, 0)}
          >
            Month by Month
          </ListItem>
          <ListItem
            selected={selectedIndex === 1}
            onClick={(event) => handleClick(event, 1)}
          >
            YTD
          </ListItem>
          <ListItem
            selected={selectedIndex === 2}
            onClick={(event) => handleClick(event, 2)}
          >
            Over the past 4 years
          </ListItem>
        </List>
      </Header>
      <Image src={chart} alt="chart" priority width="auto" height="auto" />
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(2)};
    background: ${theme.colors.palette.white};
    border-radius: 10px;    
    height: 100%;

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding: ${theme.spacing(4)};
    }

    h2 {
      font-size: 18px;

      @media (min-width: ${theme.breakpoints.values.lg}px) {
        font-size: 24px;
      }
    }
    
    img {
      max-width: 100%;
      height: auto;    
    }
  `}
`;

const Header = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing(4)};   
    flex-wrap: wrap;
    gap: 10px;

    .MuiList-root {
      display: flex;
      padding: 0;
      overflow: auto;

      .MuiListItem-root {
        width: auto;
        cursor: pointer;
        border-radius: 20px;
        font-size: 14px;
        height: 32px;
        white-space: nowrap;

        &.Mui-selected {
          background: ${theme.colors.palette.orange};
          color: ${theme.colors.palette.white};
        }
      }
    }
   `}
`;
