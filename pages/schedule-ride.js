import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Head from "next/head";
import { getSession } from "next-auth/react";
import styled from "@emotion/styled";
import { Grid, Typography } from "@mui/material";
import Layout from "@/components/common/Layout";
import ScheduleRideTile from "@/components/common/ScheduleRideTile";
import PageTitle from "@/components/common/PageTitle";
import LargeInnerContent from "@/components/presentation/LargeInnerContent";
import ThemeProvider from "@/theme/ThemeProvider";
import { api } from "@/utils/api/common";
import SpinnerLoader from "@/components/common/SpinnerLoader";

const favoriteDestination = ({ ScheduleRide, session }) => {
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(false);
  const [scheduleRideData, setScheduleRideData] = useState(null);

  const areYouSure = () => setOpen(true);
  const close = () => setOpen(false);

  const cancelSchedule = async () => {
    const {
      user: { token_code, customer_id },
    } = session;

    const formData = new FormData();

    console.log("customer_id",customer_id)

    formData.append("customer_id", customer_id);
    formData.append("token_code", token_code);
    setLoading(true);

    const scheduleRide = await api({
      url: "/customer/booking/cancel-schedule-ride",
      method: "POST",
      data: formData,
    });

    if (scheduleRide.status) {
      setOpen(false);
      setLoading(false);
      toast.success(scheduleRide.message);
      window.location.reload();
    } else {
      setOpen(false);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchScheduleRide = async () => {
      if (!session) return;

      try {
        const response = await api({
          url: "/customer/booking/schedule-ride",
          method: "GET",
        });

        if (response?.status === true && response?.data) {
          setScheduleRideData(response.data);
        } else {
          toast.error(response.message || "Failed to load scheduled rides");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleRide();
  }, [session]);

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride | Schedule Ride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SpinnerLoader loading={loading} />
        <LargeInnerContent>
          <Box>
            <HeadSection>
              <PageTitle
                title="Schedule Your"
                subtitle="Rides"
                images_icon={"../location.png"}
              ></PageTitle>
            </HeadSection>
            <Grid container spacing={3}>
              {scheduleRideData ? (
                Array.isArray(scheduleRideData) ? (
                  scheduleRideData.map((content, index) => (
                    <Grid item xs={12} md={12} key={`schedule-${index}`}>
                      <ScheduleRideTile
                        content={content}
                        cancelSchedule={cancelSchedule}
                        open={open}
                        areYouSure={areYouSure}
                        close={close}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12} md={12}>
                    <ScheduleRideTile
                      content={scheduleRideData}
                      cancelSchedule={cancelSchedule}
                      open={open}
                      areYouSure={areYouSure}
                      close={close}
                    />
                  </Grid>
                )
              ) : (
                <Grid item xs={12} md={12} textAlign="center">
                  <Typography>No schedule ride found</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </LargeInnerContent>
      </Layout>
    </ThemeProvider>
  );
};

export default favoriteDestination;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

const Box = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    padding: 24px;
  `}
`;

const HeadSection = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
    }
  `}
`;
