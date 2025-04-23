import React, { useState } from "react";
import styled from "@emotion/styled";
import CopyRight from "./CopyRight";
import TopBar from "./TopBar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import MessageModel from "./model/MessageModel";
import SpinnerLoader from "./SpinnerLoader";
import { toast } from "react-toastify";
import { api } from "@/utils/api/common";

export default function Layout({ children }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);

  const handleDeleteAccount = async () => {
    if (!showPasswordField) {
      setShowPasswordField(true);
      return; // Wait for user to enter password first
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("customer_id", session?.user.customer_id);
    formData.append("token_code", session?.user.token_code);
    formData.append("password", password);
    
  const requestBody = {
    password: password
  }

    const response = await api({
      url: "/customer/delete-account",
      method: "DELETE",
      data: requestBody,
    });

    console.log("response",response)

    if (response.status === true) {
      setLoading(false);
      toast.success(response.message);
      await signOut({ redirect: false });
      router.push("/login");
    } else if (response.message == "Invalid token code") {
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
      toast.error(response.message || "Failed to delete account");
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
          setPassword("");
        }}
        handleAction={handleDeleteAccount}
        message="Do you want to delete account?"
        showPasswordField={showPasswordField}
        password={password}
        onPasswordChange={setPassword}
      />

      <Main>
        {session &&
        session.user.status === true ? (
          <TopBar setOpenDelete={setOpenDelete} />
        ) : (
          ""
        )}
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
