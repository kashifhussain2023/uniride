import Layout from '@/components/common/Layout';
import PageTitle from '@/components/common/PageTitle';
import RiderHistory from '@/components/common/history/List';
import LargeInnerContent from '@/components/presentation/LargeInnerContent';
import ThemeProvider from '@/theme/ThemeProvider';
import { api } from '@/utils/api/common';
import styled from '@emotion/styled';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SpinnerLoader from '@/components/common/SpinnerLoader';

export default function RiderHistoryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTitle, setSubTitle] = useState('History');

  const getRiderHistoryList = async () => {
    if (!session?.accessToken) return;

    try {
      const response = await api({
        headers: {
          'x-login-method': `jwt`,
        },
        method: 'GET',
        url: '/customer/booking/ride-history',
      });

      if (response.status === true) {
        setLoading(false);
        setHistoryData(response.data.data);
      } else {
        setLoading(false);
        if (response.data.message === 'Invalid token code') {
          router.push('/login');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching ride history:', error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      getRiderHistoryList();
    }
  }, [status, session]);

  if (!session) {
    return <SpinnerLoader loading={true} />;
  }

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpinnerLoader loading={loading} />
      <Layout>
        <LargeInnerContent>
          <Box>
            <PageTitle title="Ride" subtitle={subTitle} images_icon={'../history.png'}></PageTitle>
            <RiderHistory riderHistory={historyData} setSubTitle={setSubTitle} />
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
