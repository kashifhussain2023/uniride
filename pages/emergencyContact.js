import React,{useState,useEffect} from "react";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import SmallContent from "@/components/presentation/SmallContent";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import {Button, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]'
import { api } from "@/utils/api/common";
import { useRouter } from "next/router";


export default function EmergencyContacts({userAuth}) {
  const router = useRouter();
  const [ emergencyList, setEmergencyList ] = useState();

  const getEmergencyContactList = async () => {
    const formData = new FormData();
    
    //formData.append('customer_id',userAuth.customer_id);
    formData.append('token_code',userAuth.token_code);
    const response = await api({
      url: '/customer/emergency/update',
      method: 'POST',
      data: formData,
    });
    
    if (response.status === "1") {
      console.log('contactdata',response.data);
      if(response.data.length>0){
        setEmergencyList(response.data);
        console.log(response.data);
      }else{
        router.push('/emergencyContactAdd');
      }
      
      
    } 
  }; 
  const handleEditContact = () =>{
    router.push('/emergencyContactEdit');
  }
  useEffect(() => {
    getEmergencyContactList();
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
        <SmallContent>
          <EmergencyContact>
            <EmergencyHead>
              <PageTitle
                title="Emergency"
                subtitle="Contact"
                images_icon={"../emergencyContact.png"}
              ></PageTitle>
              <Button variant="contained" color="primary">
                Add Contact
              </Button>
         </EmergencyHead>
         
          <EmergenceyList>
         <TableContainer >
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
         <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Email</TableCell>
            <TableCell >Phone No.</TableCell>
            <TableCell >Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {emergencyList ? (
        emergencyList.map((list, index) => (
        <TableRow>
        <TableCell>{list.name}</TableCell>
        <TableCell>{list.email}</TableCell>
        <TableCell>{list.phone}</TableCell>
        <TableCell><EditIcon/> <DeleteOutlineIcon/></TableCell>
        </TableRow>
         ))
         ) : (
           <TableRow>
               <Typography>No records found</Typography>
           </TableRow>
         )}
        </TableBody>

         </Table>



         </TableContainer>
          

         </EmergenceyList>
       
         
          
          </EmergencyContact>
        </SmallContent>
      </Layout>
    </ThemeProvider>
  );
}


const EmergencyContact = styled.div`
  ${({ theme }) => `
  border-radius: 16px 0px 16px 16px; box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10); background-color:${theme.colors.palette.white}; padding:24px;  margin-top:60px; 
 
 img{ max-width:100%; height:auto; display:none;

  @media (min-width: ${theme.breakpoints.values.md}px) {  
   display:block;
  }
}

    
  `}
`;

const EmergencyHead = styled.div`
  ${({ theme }) => `
  display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:10px; 
  @media (min-width: ${theme.breakpoints.values.sm}px) {           
      flex-wrap:nowrap; margin-bottom:0px; 
      
    }

  `}
`;
const EmergenceyList = styled.div`
  ${({ theme }) => `
 background-color:${theme.colors.palette.white}; border:1px solid #e9e9e9; border-radius:12px; padding:12px;  

.MuiSvgIcon-root{ background-color:${theme.colors.palette.lightGrey}; border-radius:100%; padding:5px; }
.MuiTableRow-root{
  &:last-child{
    .MuiTableCell-root{ border-bottom:0px;}
  }
}
.MuiTableCell-root {padding: 10px; font-size:14px;}


  `}
`;

const RightSection = styled.div`
  ${({ theme }) => `
width:100%; flex:0 0 50%;

    
  `}
`;




const FtButton = styled.div`
  ${({ theme }) => `
button{ margin-bottom:20px;}

    
  `}
`;
export async function getServerSideProps(context) {
  // You can access the session and user information here.
  const session = await getSession(context);
  
  
  if (!session) {
    // Handle unauthenticated access
    return {
      redirect: {
        destination: '/login',
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
