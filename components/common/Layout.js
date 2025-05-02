import { api } from '@/utils/api/common';
import styled from '@emotion/styled';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import CopyRight from './CopyRight';
import MessageModel from './model/MessageModel';
import SpinnerLoader from './SpinnerLoader';
import TopBar from './TopBar';
export default function Layout({ children }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const handleDeleteAccount = async () => {
    if (!showPasswordField) {
      setShowPasswordField(true);
      return;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('password', password);
    const response = await api({
      data: formData,
      method: 'DELETE',
      url: '/customer/delete-account',
    });
    if (response.status === true) {
      setLoading(false);
      toast.success(response.message);
      await signOut({
        redirect: false,
      });
      router.push('/login');
    } else if (response.message === 'Invalid token code') {
      await signOut({
        redirect: false,
      });
      router.push('/login');
    } else {
      setLoading(false);
      toast.error(response.message || 'Failed to delete account');
    }
  };
  return (
    <LayoutContainer>
      <SpinnerLoader loading={loading} />
      <MessageModel
        open={openDelete}
        close={() => {
          setOpenDelete(false);
          setShowPasswordField(false);
          setPassword('');
        }}
        handleAction={handleDeleteAccount}
        message="Do you want to delete account?"
        showPasswordField={showPasswordField}
        password={password}
        onPasswordChange={setPassword}
      />

      <Main>
        {session && session.user.status === true ? <TopBar setOpenDelete={setOpenDelete} /> : ''}
        <Middle>{children}</Middle>
        <CopyRight />
      </Main>
    </LayoutContainer>
  );
}
const LayoutContainer = styled.div`
  height: auto;
  display: flex;
`;
const Main = styled.div`
  ${({ theme }) => `
    flex: 1;
    background: ${theme.colors.palette.cream};
    min-height: 100vh;
  `}
`;
const Middle = styled.div`
  max-height: calc(100vh - 150px);
  overflow: auto;
`;
