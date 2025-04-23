import React, { useState, useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import LargeInnerContent from "@/components/presentation/LargeInnerContent";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import DestinationList from "@/components/common/destination/Destination";
import { api } from "@/utils/api/common";
import AddLocation from "@/components/common/model/AddLocation";

export default function favoriteDestination({ userAuth }) {
  const router = useRouter();
  const { type, page } = router.query;

  const [favoriteLocationList, setFavoriteLocationList] = useState();
  const [openFavoriteModel, setOpenFavoriteModel] = useState(false);

  const handleOpenLocationModel = () => {
    setOpenFavoriteModel(true);
  };
  const handleCloseLocationModel = () => {
    setOpenFavoriteModel(false);
  };

  const getFavoriteLocationList = async () => {
    const formData = new FormData();

    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customer/address/list",
      method: "POST",
      data: formData,
    });

    if (response.status === true) {
      if (response.data.data.length > 0) {
        setFavoriteLocationList(response.data.data);
      }
    } else if (response.message == "Invalid token code") {
      await signOut({ redirect: false });
      router.push("/login");
    }
  };
  useEffect(() => {
    getFavoriteLocationList();
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
            <HeadSection>
              <PageTitle
                title="Favorite"
                subtitle="Destination"
                images_icon={"../location.png"}
              ></PageTitle>
              <ButtonArea>
                <Button
                  variant="containedSecondary"
                  onClick={handleOpenLocationModel}
                >
                  Add New Location
                </Button>
                <AddLocation
                  open={openFavoriteModel}
                  handleClose={handleCloseLocationModel}
                  userAuth={userAuth}
                  getFavoriteList={getFavoriteLocationList}
                />
              </ButtonArea>
            </HeadSection>
            <Grid container spacing={3}>
              <DestinationList
                favoritelist={favoriteLocationList}
                type={type}
                redirectPage={page}
                getFavoriteList={getFavoriteLocationList}
                userAuth={userAuth}
              />
            </Grid>
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

const ButtonArea = styled.div`
  ${({ theme }) => `
    width: 170px;
    flex: 0 0 170px;
    margin-bottom: 15px;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      margin-bottom: 0px;
    }
  `}
`;
