'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, useTheme, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';
import ThemeProvider from '@/theme/ThemeProvider';
import Head from 'next/head';
import Layout from '@/components/common/Layout';
export default function ErrorPage() {
  const router = useRouter();
  const theme = useTheme();
  useEffect(() => {
    // Ensure we're on the correct domain
    if (window.location.hostname !== 'uniride.frontend') {
      window.location.hostname = 'uniride.frontend';
      window.location.port = '3000';
    }
  }, []);
  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="sm">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              minHeight: '100vh',
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                width: '100%',
              }}
            >
              {/* Error SVG Illustration */}
              <Box
                sx={{
                  mb: 4,
                }}
              >
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke={theme.palette.error.main}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 9L9 15"
                    stroke={theme.palette.error.main}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9L15 15"
                    stroke={theme.palette.error.main}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>

              {/* Error Message */}
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: 'text.primary',
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                Oops! Something went wrong
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                We encountered an unexpected error. Please try signing in again.
              </Typography>

              {/* Button Group */}
              <Stack spacing={2} direction="column" alignItems="center">
                {/* Primary Button */}
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={handleSignOut}
                  startIcon={<LogoutIcon />}
                  sx={{
                    '&:hover': {
                      boxShadow: 4,
                    },
                    borderRadius: 2,
                    boxShadow: 2,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                  }}
                >
                  Sign Out
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}
