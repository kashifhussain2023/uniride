import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import styled from "@emotion/styled";
import { List, ListItem, Rating, Typography } from "@mui/material";
import Layout from "@/components/common/Layout";
import PageTitle from "@/components/common/PageTitle";
import LargeInnerContent from "@/components/presentation/LargeInnerContent";
import ThemeProvider from "@/theme/ThemeProvider";

export default function riderHistoryDetail() {
  const [value, setValue] = useState(2);

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <LargeInnerContent>
          <Box>
            <PageTitle
              title="Rider"
              subtitle="History Detail"
              images_icon={"../history.png"}
            ></PageTitle>
            <HistoryImage onClick={() => router.push("/riderHistoryDetail")}>
              <Image
                src="/map.png"
                alt="Map Image Uniride"
                layout="fill"
                objectFit="cover"
              />
            </HistoryImage>
            <RiderName variant="h3">Chirayu Dsa</RiderName>
            <InfoList disablePadding style={{ marginBottom: 30 }}>
              <ListItem>
                <Typography color="error">PICKUP LOCATION</Typography>
                <Right>
                  <Typography>DESTINATION LOCATION</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Jagatpura, Jaipur, Rajasthan, India</Typography>
                <Right>
                  <Typography>
                    Jhalana Doongri, Jaipur, Rajasthan 302004, India
                  </Typography>
                </Right>
              </ListItem>
            </InfoList>
            <InfoList disablePadding>
              <ListItem>
                <Typography>Ride Type</Typography>
                <Right>
                  <Typography>Regular</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Time</Typography>
                <Right>
                  <Typography>10:20:58</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Date</Typography>
                <Right>
                  <Typography>08/01/2024</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Rated</Typography>
                <Right>
                  <Typography>
                    <Rating name="read-only" value={value} readOnly />
                  </Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Total Fare</Typography>
                <Right>
                  <Typography>$1.00</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Distance</Typography>
                <Right>
                  <Typography>0.00mi</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Duration</Typography>
                <Right>
                  <Typography>00:00:02</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Payment done by</Typography>
                <Right>
                  <Typography>Card</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Status</Typography>
                <Right>
                  <Typography variant="success">Success</Typography>
                </Right>
              </ListItem>
            </InfoList>
          </Box>
        </LargeInnerContent>
      </Layout>
    </ThemeProvider>
  );
}

const Box = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    padding: 24px;
  `}
`;

const HistoryImage = styled.div`
  ${({ theme }) => `
    width: 100%;
    height: 200px;
    position: relative;

    @media (min-width: ${theme.breakpoints.values.md}) {
      height: 400px;
    }

    img {
      max-width: 100%;
    }
  `}
`;

const RiderName = styled(Typography)`
  ${({ theme }) => `
    text-transform: uppercase;
    padding: ${theme.spacing(1, 0)};
  `}
`;

const InfoList = styled(List)`
  &.MuiList-root {
    .MuiListItem-root {
      padding-left: 0;
      padding-right: 0;
      justify-content: space-between;
      font-size: 14px;
    }
  }
`;

const Right = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
  text-align: right;
`;
