import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Tooltip,
  Typography,
  Box,
  Link,
} from "@mui/material";
import {
  Close,
  ExpandMore,
  Logout,
  AccountCircle,
  PersonAdd,
  Settings,
} from "@mui/icons-material";
import { menuIcons, headerIcons } from "@/utils/constant";

export const icons = {
  Logout,
  AccountCircle,
  PersonAdd,
  Settings,
};

export default function TopBar({ setOpenDelete }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { data: session } = useSession();

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async (e) => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const openDelete = () => {
    setOpenDelete(true);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 405 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <SidebarTop>
        <Logo>
          <Image
            src="/logo.jpg"
            layout="responsive"
            alt="logo"
            width={112}
            height={43}
          />
        </Logo>
        <DrawerBtn onClick={toggleDrawer(anchor, true)}>
          <Close />
        </DrawerBtn>
      </SidebarTop>
      <Divider />
      <DrawerMenu>
        <List>
          {menuIcons.map(({ label, icon, path }) => {
            return (
              <MenuItem
                key={label}
                selected={path === router.asPath}
                onClick={() => router.push(path)}
              >
                <ListItemIcon>
                  <Image
                    src={`${icon}`}
                    layout="responsive"
                    alt="logo"
                    width={30}
                    height={30}
                  />
                </ListItemIcon>
                {label}
              </MenuItem>
            );
          })}
          <MenuItem key="delete" onClick={openDelete}>
            <ListItemIcon>
              <Image
                src="/icon/deleteAccountIcon.png"
                layout="responsive"
                alt="logo"
                width={30}
                height={30}
              />
            </ListItemIcon>
            Delete Account
          </MenuItem>
        </List>

        <MenuHeader>
          <Divider />
          <List>
            {headerIcons.map(({ label, icon, path }) => {
              return (
                <MenuItem key={label} onClick={() => router.push(path)}>
                  <ListItemIcon>
                    <Image
                      src={`/${icon}`}
                      layout="responsive"
                      alt="logo"
                      width={30}
                      height={30}
                    />
                  </ListItemIcon>
                  {label}
                </MenuItem>
              );
            })}
          </List>
        </MenuHeader>
      </DrawerMenu>
    </Box>
  );

  return (
    <Header>
      <Container>
        <LeftBar>
          <Logo>
            <Image
              src="/logo.jpg"
              layout="responsive"
              alt="logo"
              width={112}
              height={43}
            />
          </Logo>
          <div>
            {["left"].map((anchor) => (
              <React.Fragment key={anchor}>
                <DrawerBtn onClick={toggleDrawer(anchor, true)}>
                  <Image
                    src="/menu-icon.png"
                    layout="responsive"
                    alt="logo"
                    width={27}
                    height={19}
                  />
                </DrawerBtn>
                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </div>
          <MainMenu>
            <MenuList>
              {headerIcons.map(({ label, path }) => {
                return (
                  <MenuItem
                    selected={path === router.asPath}
                    key={label}
                    onClick={() => router.push(path)}
                  >
                    {label}
                  </MenuItem>
                );
              })}
            </MenuList>
          </MainMenu>
        </LeftBar>
        <RightBar>
          <AccountTooltip>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              disableRipple
            >
              <Avatar
                sx={{ width: 40, height: 40 }}
                alt="Mani Sharp"
                src={session?.user?.customer_image || "../avatar-photo.png"}
              />
              <Typography component="span">
                {session?.user?.name || ""}
              </Typography>
              <ExpandMore />
            </IconButton>
          </AccountTooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </RightBar>
      </Container>
    </Header>
  );
}

const Header = styled.div`
  ${({ theme }) => `
    padding-top: calc(${theme.spacing(2)} - 5px);
    padding-bottom: calc(${theme.spacing(2)} - 10px);
    background: ${theme.colors.palette.white};
    border-bottom: 1px solid ${theme.colors.palette.lightGrey};
    box-shadow: 0px 2px 25px 0px rgba(0, 0, 0, 0.14);
    position: sticky;
    z-index: 999;
    top: 0;

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding-top: calc(${theme.spacing(2)} - 5px);
      padding-bottom: calc(${theme.spacing(2)} - 10px);
    }
  `}
`;

const Container = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    max-width: 1776px;
    margin: 0 auto;
    padding: 0px ${theme.spacing(2)};
  `}
`;

const DrawerBtn = styled.button`
  ${({ theme }) => `
    padding: 0px !important;
    background-color: transparent;
    border: 0px solid ${theme.colors.palette.orange};
    margin-right: ${theme.spacing(1)};
    cursor: pointer;
    width: 22px;
  `}
`;

const RightBar = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  ${({ theme }) => `
    width: 112px;
    position: relative;
    top: 5px;
    margin-right: ${theme.spacing(2)};
  `}
`;

const LeftBar = styled.div`
  display: flex;
  align-items: center;
`;

const MainMenu = styled.div`
  ${({ theme }) => `
    li {
      display: none;

      @media (min-width: ${theme.breakpoints.values.md}px) {
        display: inline-block;
      }

      &:hover {
        background-color: transparent;
      }

      a {
        font-size: 14px;
        text-transform: uppercase;
        color: ${theme.colors.palette.black};
        text-decoration: none;
        padding-bottom: ${theme.spacing(3)};
        font-weight: 400;

        @media (min-width: ${theme.breakpoints.values.lg}px) {
          font-size: 16px;
          padding-bottom: ${theme.spacing(3)};
        }

        &:hover {
          border-bottom: 2px solid ${theme.colors.palette.orange};
          color: ${theme.colors.palette.orange};
        }
      }
    }

    .MuiMenuItem-root {
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 0px;

      &.Mui-selected {
        background: none;
        color: ${theme.colors.palette.orange};
      }

      @media (min-width: ${theme.breakpoints.values.lg}px) {
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};
        padding-top: 4px;
      }
    }
  `}
`;

const AccountTooltip = styled(Tooltip)`
  ${({ theme }) => `
    &.MuiIconButton-root {
      margin-right: -5px;
      margin-top: -1px;
    }

    .MuiTypography-root {
      display: none;
    }

    @media (min-width: ${theme.breakpoints.values.md}px) {
      .MuiTypography-root {
        display: block;
      }
    }

    .MuiSvgIcon-root {
      color: ${theme.colors.palette.black};

      @media (min-width: ${theme.breakpoints.values.md}px) {
        margin-left: ${theme.spacing(1)};
      }
    }

    .MuiAvatar-root {
      margin-right: ${theme.spacing(1)};
    }
  `}
`;

const DrawerMenu = styled(Tooltip)`
  ${({ theme }) => `
    .MuiMenuItem-root {
      margin-bottom: ${theme.spacing(1)};

      .MuiListItemIcon-root {
        margin-right: ${theme.spacing(1)};
        background-color: ${theme.colors.palette.white};
        border: 1px solid ${theme.colors.palette.white};
        border-radius: 4px;
        box-shadow: 0px 0px 10px -1px rgba(0, 0, 0, 0.21);
        min-width: 32px;
      }

      &:hover,
      &.Mui-selected, &.active {
        background-color: transparent;
        position: relative;
        color: ${theme.colors.palette.black};

        &::after {
          position: absolute;
          content: "";
          background-color: ${theme.colors.palette.orange};
          top: -5px;
          right: 0px;
          width: 8px;
          height: 53px;
          border-radius: 10px 0px 0px 10px;
        }
        .MuiListItemIcon-root {
          background-color: ${theme.colors.palette.orange}33;

          img {
            filter: invert(62%) sepia(95%) saturate(1326%) hue-rotate(360deg)
              brightness(104%) contrast(107%);
          }
        }
      }      
    }
  `}
`;

const MenuHeader = styled(Tooltip)`
  ${({ theme }) => `  
    display: block;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: none;
    }
  `}
`;

const SidebarTop = styled.div`
  ${({ theme }) => ` 
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(2)};    
  `}
`;
