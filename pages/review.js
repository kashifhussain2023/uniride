import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import { Button, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InnerContent from "@/components/presentation/InnerContent";

import theme from "@/theme";

export default function Review({ userAuth }) {
  const [reviewPageDetail, setReviewPageDetail] = useState();
  const getReviewPageDetail = async (ride_type) => {
    const formData = new FormData();
    formData.append("user_type", "rider");
    formData.append("ride_type", ride_type);
    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/common/get_rating_questions",
      method: "POST",
      data: formData,
    });
    if (response.status === "1") {
      setReviewPageDetail(response.data);
    }
  };
  useEffect(() => {
    socket.on("track_ride", (response) => {
      if (response.status === "TRUE" && response.code === 7) {
        getReviewPageDetail(response.data.ride_type);
      }
    });
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
        <InnerContent>
          <PannelSection>
            <LeftPannel>
              <PageTitle
                title="Customer"
                subtitle="Review"
                images_icon={"../review.png"}
              ></PageTitle>

              <RouteDetail>
                <ReviewHead>
                  <BookingLabel>
                    <Typography variant="h3" component="h3">
                      Prime SUV
                    </Typography>
                    5 People
                  </BookingLabel>
                  <Details>
                    <Price>$114</Price>
                  </Details>
                </ReviewHead>
                <ActiveLocation>
                  <Typography variant="h4">Apparel Park Industrial</Typography>
                  <Typography variant="subtitle3" component="p">
                    Area, CP4-228/229, Mahal Road, Jagatpura, Jaipur, Shri
                    Kishanpura, Rajasthan 302017
                  </Typography>
                </ActiveLocation>
                <PreviousLocation>
                  <Typography variant="h4">Apparel Park Industrial</Typography>
                  <Typography variant="subtitle3" component="p">
                    Area, CP4-228/229, Mahal Road, Jagatpura, Jaipur, Shri
                    Kishanpura, Rajasthan 302017
                  </Typography>
                </PreviousLocation>
              </RouteDetail>
              <TipYourDriver>
                <Typography variant="h4">Tip Your Driver</Typography>
                <Typography variant="subtitle3" component="p">
                  Thank your driver by leaving them a Tip. 100% of the Tip will
                  go to your driver.
                </Typography>
                <List>
                  <ListItem>
                    <Button>10%</Button>
                  </ListItem>
                  <ListItem>
                    <Button>15%</Button>
                  </ListItem>
                  <ListItem>
                    <Button>20%</Button>
                  </ListItem>
                  <ListItem>
                    <Button>Custom</Button>
                  </ListItem>
                </List>
              </TipYourDriver>
              <RideInfo>
                <RouteDetail>
                  <List>
                    <ListItem>
                      <BookingLabel>Trip Distance</BookingLabel>
                      <Details>0.00 miles</Details>
                    </ListItem>
                    <ListItem>
                      <BookingLabel>Trip Duration</BookingLabel>
                      <Details>00:00:24</Details>
                    </ListItem>
                    <ListItem>
                      <BookingLabel>Payment Type</BookingLabel>
                      <Details>Card</Details>
                    </ListItem>
                    <ListItem>
                      <BookingLabel>Ride Type</BookingLabel>
                      <Details>Regular</Details>
                    </ListItem>
                  </List>
                </RouteDetail>
              </RideInfo>
            </LeftPannel>
            <RightPannel>
              <Typography variant="h3">Rate your trip experience</Typography>
              <Rating>
                <List>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Behavior" src="/behavior.png" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Behavior"
                      secondary={
                        <React.Fragment>
                          <StarIcon /> <StarIcon /> <StarIcon />
                          <StarHalfIcon />
                          <StarBorderIcon />
                        </React.Fragment>
                      }
                    />
                  </ListItem>

                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Punctual" src="/Punctual.png" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Punctual"
                      secondary={
                        <React.Fragment>
                          <StarIcon /> <StarIcon /> <StarIcon />
                          <StarHalfIcon />
                          <StarBorderIcon />
                        </React.Fragment>
                      }
                    />
                  </ListItem>

                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Cleanliness and Hygiene"
                        src="/Hygiene.png"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Cleanliness and Hygiene"
                      secondary={
                        <React.Fragment>
                          <StarIcon /> <StarIcon /> <StarIcon />
                          <StarHalfIcon />
                          <StarBorderIcon />
                        </React.Fragment>
                      }
                    />
                  </ListItem>

                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Local Knowledge" src="/local.png" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Local Knowledge"
                      secondary={
                        <React.Fragment>
                          <StarIcon /> <StarIcon /> <StarIcon />
                          <StarHalfIcon />
                          <StarBorderIcon />
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </List>
              </Rating>
              <ReviewArea>
                <ReviewComment>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Comments
                  </Typography>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    placeholder="Start typing..."
                    style={{ width: "100%", height: "290px" }}
                  />
                </ReviewComment>
              </ReviewArea>

              <CommentFooter>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Submit
                </Button>
              </CommentFooter>
            </RightPannel>
          </PannelSection>
        </InnerContent>
      </Layout>
    </ThemeProvider>
  );
}

const ReviewBox = styled.div`
  ${({ theme }) => `
  border-radius: 16px 0px 16px 16px; box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10); background-color:${theme.colors.palette.white}; padding:24px;  margin-top:60px;

 img{ max-width:100%;}

 button{margin-left: auto; display: flex; justify-content: center; }


    
  `}
`;

const ReviewArea = styled.div`
  ${({ theme }) => `
 display:flex; justify-content:space-between; flex-wrap:wrap; 
 @media (min-width: ${theme.breakpoints.values.md}px) {           
    flex-wrap:no-wrap; 
    
  }

    
  `}
`;

const Rating = styled.div`
  ${({ theme }) => `
  width:100%;
    .MuiSvgIcon-root { color: ${theme.colors.palette.orange}; }

    

  `}
`;

const ReviewComment = styled.div`
  ${({ theme }) => `
width:100%;

textarea{ padding:20px; border:1px solid ${theme.colors.palette.grey}; border-radius:6px; font-size:16px; fontFamily: "'Encode Sans', sans-serif"; width:100%; }
   

  `}
`;

const PannelSection = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    flex-wrap:wrap;

    @media (min-width: ${theme.breakpoints.values.md}px) {           
      flex-wrap:nowrap;
    }
    
    
  `}
`;

const LeftPannel = styled.div`
  ${({ theme }) => `

  background-color:${theme.colors.palette.white};
  width:100%;
  flex:0 0 100%; margin-bottom:15px;
  
  margin-right: calc(${theme.spacing(2)} + 14px); border-radius:16px;
  padding:${theme.spacing(2)};
  box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10);
  @media (min-width: ${theme.breakpoints.values.md}px) {           
    width:386px;
  flex:0 0 386px;
  margin-bottom:0px;
  border-radius:16px 0px 16px 16px;
  }
  .MuiTableCell-root{
    h4{ font-size:16px;}
  }




  `}
`;

const RightPannel = styled.div`
  ${({ theme }) => `
  position:relative;

  background-color:${theme.colors.palette.white};
  width:100%;
  box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10);
  border-radius:16px; overflow:hidden;
  padding:30px;

  @media (min-width: ${theme.breakpoints.values.md}px) { 
  border-radius:16px 0px 16px 16px;
  }
   
  img{ max-width:100%; height:100%; object-fit:cover}


  .MuiList-root{ padding:0px; margin:0px; display:flex;justify-content:center; flex-wrap:wrap;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      justify-content:inherit;
      }
  .MuiListItem-root{ width:inherit; display:inline-flex; background-color:#fcfcfc; border-radius:6px; margin-bottom:5px; width:100%;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      width:48%;
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) { 
        width:inherit;
        margin-right:2%;
        }

  &:first-child{ margin-right:inherit;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      margin-right:2%;
      }
      
     }
  &:last-child{ margin-left:inherit;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      &:last-child{ margin-left:2%;
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) { 
        &:last-child{ margin-left:0;
        }
  }
  
  
  }
  
  }
    
  `}
`;
const RouteDetail = styled.div`
  ${({ theme }) => `
    border:1px solid #e9e9e9;
    border-radius:6px;
    padding:20px 15px; margin-bottom:24px;
  `}
`;

const ReviewHead = styled.div`
  ${({ theme }) => `
    display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid ${theme.colors.palette.grey}; padding-bottom:15px; margin-bottom:20px;
  `}
`;
const BookingLabel = styled.div`
  ${({ theme }) => `
    font-size:14px; color:${theme.colors.palette.darkGrey}; width:100px; flex:0 0 100px;
  `}
`;

const Details = styled.div`
  ${({ theme }) => `
    width:100%; font-weight:700;  color:${theme.colors.palette.dGray}; text-align:right;

  `}
`;

const Price = styled.div`
  ${({ theme }) => `
    font-size:24px; color:${theme.colors.palette.orange}; font-weight:700;
  `}
`;

const ActiveLocation = styled.div`
  ${({ theme }) => `
  background-color:#f0fbf5; border-radius:6px; padding:10px 10px 10px 30px; margin-bottom:15px;
  .MuiTypography-h4{ position:relative;
  &:before{ background-color:#00ba00; border-radius:100%; content:'';    width: 8px;
  height: 8px;
  left: -17px;
  top: 7px;
  position: absolute;
}
  }
  `}
`;
const PreviousLocation = styled.div`
  ${({ theme }) => `
  background-color:#fcfcfc; border-radius:6px; padding:10px 10px 10px 30px; 
  .MuiTypography-h4{ position:relative;
    &:before{ background-color:#ef3c49; border-radius:100%; content:'';    width: 8px;
    height: 8px;
    left: -17px;
    top: 7px;
    position: absolute;
  }
    }
  `}
`;

const TipYourDriver = styled.div`
  ${({ theme }) => `
 .MuiList-root{ padding:0px; margin:10px 0px 15px 0px;
.MuiListItem-root{padding:0px; margin:0px; display:inline-block; width:inherit;
button{ padding:4px 14px; margin:0px 10px 0px 0px;min-width:inherit; width:inherit; border:1px solid #ebebeb; border-radius:45px; color:#000; font-weight:600; font-size:14px; text-decoration:none;
&:hover{ background-color:${theme.colors.palette.orange}; color:${theme.colors.palette.black};}

}

}
}
  `}
`;

const RideInfo = styled.div`
  ${({ theme }) => `
    .MuiList-root {
      padding-top: 0px;
      .MuiListItem-root {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 0px 12px 0px;
        margin: 0px 0px 12px 0px;
        border-bottom: 1px solid ${theme.colors.palette.grey};
        &:last-child {
          border-bottom: 0px solid #000;
          padding: 0px;
          margin-bottom: 0px;
        }
      }
    }
  `}
`;

const CommentFooter = styled.div`
  ${({ theme }) => `
    text-align: right;
  `}
`;
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
