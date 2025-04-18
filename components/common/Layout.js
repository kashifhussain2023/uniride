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

  const handleDeleteAccount = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("customer_id", session?.user.customer_id);
    formData.append("token_code", session?.user.token_code);
    const response = await api({
      url: "/customers/delete_customer",
      method: "POST",
      data: formData,
    });

    if (response.status === "TRUE") {
      setLoading(false);
      toast.success(response.message);
      await signOut({ redirect: false });
      router.push("/login");
    } else if (response.message == "Invalid token code") {
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
    }
  };

  const closeDelete = () => {
    setOpenDelete(false);
  };

  return (
    <LayoutContainer>
      <SpinnerLoader loading={loading} />
      <MessageModel
        open={openDelete}
        close={closeDelete}
        handleAction={handleDeleteAccount}
        message="Do you want to delete account ?"
      />
      <Main>
        {session &&
        session.user.status === "TRUE" &&
        session.user.profile_status === "3" ? (
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
