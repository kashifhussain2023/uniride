import React, { useState, useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import SmallContent from "@/components/presentation/SmallContent";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@mui/material";
import CardsList from "@/components/common/CardList";
import { api } from "@/utils/api/common";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import SpinnerLoader from "@/components/common/SpinnerLoader";

export default function SaveCards({ userAuth }) {
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const getCustomerCardList = async () => {
    const formData = new FormData();
    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customers/customer_card_list",
      method: "POST",
      data: formData,
    });

    if (response.status === "TRUE") {
      setCardList(response.card_list);
    } else if (response.message == "Invalid token code") {
      toast.error(
        "Your account has been logged in on another device.Please login again to continue."
      );
      await signOut({ redirect: false });
      router.push("/login");
    }
  };

  const handleMakeDefaultCard = async (value) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("customer_id", userAuth.customer_id);
    formData.append("card_id", value);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customers/set_default_card",
      method: "POST",
      data: formData,
    });

    if (response.status === "TRUE") {
      setLoading(false);
      toast.success(response.message);
      //getCustomerCardList();
    } else if (
      response.status === "FALSE" &&
      response.message === "Invalid token code"
    ) {
      setLoading(false);
      toast.error(
        "Your account has been logged in on another device.Please login again to continue."
      );
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
      toast.success(response.message);
    }
  };
  const handleDeleteCard = async (value) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("customer_id", userAuth.customer_id);
    formData.append("card_id", value);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customers/delete_card",
      method: "POST",
      data: formData,
    });

    if (response.status === "TRUE") {
      setLoading(false);
      toast.success(response.message);
      getCustomerCardList();
    } else if (
      response.status === "FALSE" &&
      response.message === "Invalid token code"
    ) {
      setLoading(false);
      toast.error(
        "Your account has been logged in on another device.Please login again to continue."
      );
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
      toast.success(response.message);
    }
  };
  const handleAddCardClick = () => {
    // Redirect to the desired page
    router.push("/addPaymentInfo");
  };
  useEffect(() => {
    getCustomerCardList();
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
        <SmallContent>
          <SaveCardsBox>
            <SaveCardHead>
              <PageTitle
                title="Save"
                subtitle="Cards"
                images_icon={"../cards.png"}
              ></PageTitle>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCardClick}
              >
                Add Card
              </Button>
            </SaveCardHead>
            <CardsList
              cardList={cardList}
              onDefaultCardChange={handleMakeDefaultCard}
              onDeleteCard={handleDeleteCard}
            />
          </SaveCardsBox>
        </SmallContent>
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
const SaveCardsBox = styled.div`
  ${({ theme }) => `
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    background-color: ${theme.colors.palette.white};
    padding: 24px;
    margin-top: 15px;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      margin-top: 60px;
    }

    img {
      max-width: 100%;
    }
  `}
`;

const SaveCardHead = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 10px;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      flex-wrap: nowrap;
      margin-bottom: 0px;
    }
  `}
`;
