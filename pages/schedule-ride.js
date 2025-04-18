import { useState } from "react";
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
  const areYouSure = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const cancelSchedule = async () => {
    const {
      user: { token_code, customer_id },
    } = session;

    const formData = new FormData();

    formData.append("customer_id", customer_id);
    formData.append("token_code", token_code);
    setLoading(true);
    const scheduleRide = await api({
      url: "/customers/schedule_ride_cancel",
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
              {ScheduleRide.length > 0 ? (
                ScheduleRide.map((content, index) => (
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
    // Handle unauthenticated access
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (session && session?.user.profile_status !== "3") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const {
    user: { token_code, customer_id },
  } = session;

  const formData = new FormData();

  formData.append("customer_id", customer_id);
  formData.append("token_code", token_code);

  const ScheduleRide = await api({
    url: "/customers/schedule_ride_detail",
    method: "POST",
    data: formData,
  });
  if (ScheduleRide.message == "Invalid token code") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ScheduleRide: ScheduleRide.data,
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
