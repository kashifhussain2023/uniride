import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ThemeProvider from '@/theme/ThemeProvider';
import Layout from '@/components/common/Layout';
import SmallContent from '@/components/presentation/SmallContent';
import styled from '@emotion/styled';
import PageTitle from '@/components/common/PageTitle';
import { Button, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { api } from '@/utils/api/common';
import DeleteModel from '@/components/common/model/DeleteModel';
import { toast } from 'react-toastify';
export default function EmergencyContacts() {
  const router = useRouter();
  const [emergencyList, setEmergencyList] = useState();
  const [open, setOpen] = useState(false);
  const getEmergencyContactList = async () => {
    const formData = new FormData();
    const response = await api({
      data: formData,
      method: 'GET',
      url: '/customer/emergency/list',
    });
    if (response.status === true) {
      const list = response?.data?.data || [];
      setEmergencyList(list);
    } else if (response.message === 'Invalid token code') {
      await signOut({
        redirect: false,
      });
      router.push('/login');
    } else {
      setEmergencyList([]);
    }
  };
  const editContact = id => {
    router.push(`/emergency-contact/edit/${id}`);
  };
  const handleDelete = async contactId => {
    try {
      const response = await api({
        method: 'DELETE',
        url: `/customer/emergency/remove/${contactId}`,
      });
      if (response.status === true) {
        toast.success('Emergency contact deleted successfully');
        setOpen(false);
        setEmergencyList(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
      } else {
        toast.error(response.message || 'Failed to delete emergency contact');
      }
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      toast.error('An error occurred while deleting the contact');
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
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
                images_icon={`${process.env.NEXTAUTH_URL}/emergencyContact.png`}
              ></PageTitle>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/emergency-contact/add')}
              >
                Add Contact
              </Button>
            </EmergencyHead>
            {emergencyList ? (
              <EmergenceyList>
                <TableContainer>
                  <Table
                    sx={{
                      minWidth: 650,
                    }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone No.</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emergencyList.length > 0 ? (
                        emergencyList.map(list => (
                          <TableRow key={list.id}>
                            <TableCell>{list.name}</TableCell>
                            <TableCell>{list.email}</TableCell>
                            <TableCell>
                              {list.country_code} {list.phone}
                            </TableCell>
                            <TableCell>
                              <EditIcon
                                onClick={() => editContact(list.id)}
                                sx={{
                                  cursor: 'pointer',
                                  mr: 1,
                                }}
                              />
                              <DeleteOutlineIcon
                                onClick={() => handleOpen(list.id)}
                                sx={{
                                  cursor: 'pointer',
                                }}
                              />
                              <DeleteModel
                                open={open}
                                handleOpen={handleOpen}
                                handleClose={handleClose}
                                actionDelete={() => handleDelete(list.id)}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography align="center">No records found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </EmergenceyList>
            ) : (
              <NoRecord>No records found</NoRecord>
            )}
          </EmergencyContact>
        </SmallContent>
      </Layout>
    </ThemeProvider>
  );
}
const EmergencyContact = styled.div`
  ${({ theme }) => `
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    background-color: ${theme.colors.palette.white};
    padding: 24px;
    margin-top: 15px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      margin-top: 60px;
    }

    img {
      max-width: 100%;
      height: auto;

      @media (min-width: ${theme.breakpoints.values.md}px) {
        display: block;
      }
      
    }
  `}
`;
const EmergencyHead = styled.div`
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
const EmergenceyList = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    border: 1px solid #e9e9e9;
    border-radius: 12px;
    padding: 12px;

    .MuiIconButton-root {
      padding: 3px;
    }

    .MuiTableContainer-root {
      max-width: calc(100vw - 140px);

      .MuiTable-root {
        min-width: auto;
      }

      .MuiTableCell-root {
        white-space: nowrap;
      }
    }

    .MuiSvgIcon-root {
      background-color: ${theme.colors.palette.lightGrey};
      border-radius: 100%;
      padding: 5px;
      cursor: pointer;

      &:hover {
        background-color: ${theme.colors.palette.grey};
      }
    }
    .MuiTableRow-root {
      &:last-child {
        .MuiTableCell-root {
          border-bottom: 0px;
        }
      }
    }
    .MuiTableCell-root {
      padding: 10px;
      font-size: 14px;
    }
  `}
`;
const NoRecord = styled(Typography)`
  ${({ theme }) => `
    padding-bottom: ${theme.spacing(3)};
    text-align: center;
    display: block;
    width: 100%;
    font-weight: 500;
  `}
`;
