import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from '@emotion/styled';
import { List, ListItem, Rating, Typography } from '@mui/material';
import Layout from '@/components/common/Layout';
import PageTitle from '@/components/common/PageTitle';
import LargeInnerContent from '@/components/presentation/LargeInnerContent';
import ThemeProvider from '@/theme/ThemeProvider';
import { api } from '@/utils/api/common';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import SafeImage from '@/components/common/SafeImage';

export default function RiderHistoryDetail() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [historyDetailData, setHistoryDetailData] = useState([]);

  const getRideHistoryDetail = async () => {
    const response = await api({
      method: 'GET',
      url: `/customer/booking/ride-history-details?request_id=${305}`,
    });
    if (response.status === true) {
      setHistoryDetailData(response.data);
      setValue(response.data.rated || 0);
    } else if (response.message === 'Invalid token code') {
      await signOut({
        redirect: false,
      });
      router.push('/login');
    }
  };

  useEffect(() => {
    getRideHistoryDetail();
  }, []);

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
            <PageTitle title="Rider" subtitle="History Detail" images_icon={'../history.png'} />

            <HistoryImage>
              <SafeImage
                src={historyDetailData.path_image || '/map.png'}
                alt="Map Image Uniride"
                width={800}
                height={400}
                style={{ height: '100%', objectFit: 'cover', width: '100%' }}
              />
            </HistoryImage>
            <RiderName variant="h3">{historyDetailData.driver_name}</RiderName>
            <InfoList
              disablePadding
              style={{
                marginBottom: 30,
              }}
            >
              <ListItem>
                <Typography color="error">PICKUP LOCATION</Typography>
                <Right>
                  <Typography>DESTINATION LOCATION</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>{historyDetailData.pickup_location}</Typography>
                <Right>
                  <Typography>{historyDetailData.dropoff_location}</Typography>
                </Right>
              </ListItem>
            </InfoList>
            <InfoList disablePadding>
              <ListItem>
                <Typography>Ride Type</Typography>
                <Right>
                  <Typography>{historyDetailData.ride_type}</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Time</Typography>
                <Right>
                  <Typography>
                    {new Date(historyDetailData.trip_date_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Date</Typography>
                <Right>
                  <Typography>
                    {new Date(historyDetailData.trip_date_time).toLocaleDateString()}
                  </Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Rated</Typography>
                <Right>
                  <Rating name="read-only" value={value} readOnly />
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Total Fare</Typography>
                <Right>
                  <Typography>₹{historyDetailData.total_fare}</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Distance</Typography>
                <Right>
                  <Typography>{historyDetailData.trip_distance} mi</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Trip Duration</Typography>
                <Right>
                  <Typography>{historyDetailData.trip_duration}</Typography>
                </Right>
              </ListItem>
              <ListItem>
                <Typography>Payment done by</Typography>
                <Right>
                  <Typography>Card ({historyDetailData.card_no})</Typography>
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
