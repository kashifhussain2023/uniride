import React, { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api/common";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import LargeInnerContent from "@/components/presentation/LargeInnerContent";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SpinnerLoader from "@/components/common/SpinnerLoader";

export default function emergencyContact({ userAuth }) {
  const [loading, setLoading] = useState(true);
  const [helpData, setHelpData] = useState([]);
  const router = useRouter();

  const getHelpData = async () => {
    setLoading(true);

    const response = await api({
      url: "/customer/get-faq",
      method: "GET",
    });

    if (response.status === true) {
      setLoading(false);
      setHelpData(response.data.data);
    } else if (response.data.message == "Invalid token code") {
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHelpData();
  }, []);

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpinnerLoader loading={loading} />
      <Layout>
        <LargeInnerContent>
          <HelpSection>
            <PageTitle subtitle="Help" images_icon={"../help.png"}></PageTitle>
            <HelpAccordion>
              {helpData ? (
                helpData?.map((helpData, index) => (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel5a-content"
                      id="panel5a-header"
                    >
                      <Typography variant="h3">
                        <span>Q</span>
                        {helpData.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{helpData.description}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography variant="h3">No rider history available</Typography>
              )}
            </HelpAccordion>
          </HelpSection>
        </LargeInnerContent>
      </Layout>
    </ThemeProvider>
  );
}
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
      userAuth: session.user || null,
    },
  };
}
const HelpSection = styled.div`
  ${({ theme }) => `
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    background-color: ${theme.colors.palette.white};
    padding: 24px;
    margin-top: 60px;

    img {
      max-width: 100%;
    }

    .MuiTypography-h2 {
      margin-top: 15px;
    }

    .MuiPaper-root {
      margin-bottom: 10px;
      box-shadow: none;
      border: 1px solid #e9e9e9;
      border-radius: 6px;
      &:before {
        display: none;
      }
    }
  `}
`;

const HelpAccordion = styled.div`
  ${({ theme }) => `
    .MuiAccordionSummary-content {
      .MuiTypography-root {
        font-size: 14px;
        display: flex;
        line-height: 20px;
        margin-right: 36px;
        align-items: center;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          font-size: 18px;
        }
        span {
          width: 34px;
          padding: 6px 10px;
        }
      }
    }

    .MuiButtonBase-root {
      span {
        background-color: ${theme.colors.palette.dGray};
        width: 33px;
        height: 33px;
        color: ${theme.colors.palette.white};
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        margin-right: 10px;
        border-radius: 4px;
      }

      &[aria-expanded="false"] {
        .MuiAccordionSummary-content {
          background-image: url(../add.png);
          background-repeat: no-repeat;
          width: 0px;
          background-position: right;
        }
      }

      &[aria-expanded=true] {
        .MuiAccordionSummary-content {
          background-image: url(../minus.png);
          background-repeat: no-repeat;
          width: 0px;
          background-position: right;
        }
      }

      .MuiAccordionSummary-expandIconWrapper {
        display: none;
      }

      MuiPaper-root-MuiAccordion-root {
        .Mui-expanded {
        }
      }
    }

    .MuiAccordion-root {
      &.Mui-expanded {
        box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1) !important;
      }
    }
  `}
`;
