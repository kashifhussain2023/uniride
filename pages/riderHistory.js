import Layout from "@/components/common/Layout";
import PageTitle from "@/components/common/PageTitle";
import RiderHistory from "@/components/common/history/List";
import LargeInnerContent from "@/components/presentation/LargeInnerContent";
import ThemeProvider from "@/theme/ThemeProvider";
import { api } from "@/utils/api/common";
import styled from "@emotion/styled";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SpinnerLoader from "@/components/common/SpinnerLoader";

export default function RiderHistoryPage({ userAuth }) {
  const router = useRouter();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTitle, setSubTitle] = useState("History");
  const getRiderHistoryList = async () => {
    const formData = new FormData();
    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    formData.append("offset", 0);
    const response = await api({
      url: "/customers/ride_history",
      method: "POST",
      data: formData,
    });
    if (response.status === "TRUE") {
      setLoading(false);
      setHistoryData(response.ride_details);
    } else if (response.message == "Invalid token code") {
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRiderHistoryList();
  }, []);
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
            <PageTitle
              title="Ride"
              subtitle={subTitle}
              images_icon={"../history.png"}
            ></PageTitle>
            <RiderHistory
              riderHistory={historyData}
              setSubTitle={setSubTitle}
            />
          </Box>
        </LargeInnerContent>
      </Layout>
    </ThemeProvider>
  );
}
export async function getServerSideProps(context) {
  // You can access the session and user information here.
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
  return {
    props: {
      userAuth: session.user || null,
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
