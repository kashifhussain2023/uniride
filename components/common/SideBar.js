import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  DashboardOutlined,
  EastOutlined,
  ExpandLess,
  ExpandMore,
  InventoryOutlined,
  PersonOutlineOutlined,
  RadioButtonUnchecked,
  ReceiptLongOutlined,
  SendTimeExtensionOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import logo from "../../public/logo.png";
import menuIcon from "../../public/menu-icon.png";
import { mainMenuItems } from "@/utils/constant";

export const icons = {
  DashboardOutlined,
  ReceiptLongOutlined,
  InventoryOutlined,
  PersonOutlineOutlined,
  SendTimeExtensionOutlined,
  SettingsOutlined,
};

export default function SideBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index, path) => {
    setOpenSubMenu(true);
    setSelectedIndex(index);
    if (path) {
      router.push(path);
    }
  };

  const handleClickOpen = () => {
    setShrink(!shrink);
    setOpen(false);
  };

  const handleClick = (event, index, path) => {
    setOpen(true);
    setSelectedIndex(index);
    if (path) {
      router.push(path);
    }
  };

  return (
    <Container shrink={shrink}>
      <LogoContainer shrink={shrink}>
        <Link href="/">
          <Image src={logo} alt="logo" priority />
        </Link>
      </LogoContainer>
      <MuiIconButton onClick={handleClickOpen} shrink={shrink}>
        {shrink ? (
          <EastOutlined />
        ) : (
          <Image src={menuIcon} alt="menu button" priority />
        )}
      </MuiIconButton>
      <List component="nav" aria-labelledby="nested-list-subheader">
        {mainMenuItems.map(({ label, path, icon, subMenu }, index) => {
          const Icon = icons[icon];
          return (
            <Fragment key={`menu-${index}`}>
              <ListItem
                selected={path === router.asPath}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClick(event, index, path);
                }}
                title={label}
                activestate={selectedIndex === index && open}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
                {subMenu &&
                  (selectedIndex === index && open ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItem>
              {subMenu && (
                <Collapse
                  in={selectedIndex === index && open}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {subMenu.map(({ title, path, subSubMenu }, index) => {
                      return (
                        <Fragment key={`sub-submenu-${index}`}>
                          <ListItemButton
                            selected={path === router.asPath}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleListItemClick(
                                event,
                                index,
                                path,
                                selectedIndex
                              );
                            }}
                            sx={{ pl: 5 }}
                          >
                            <ListItemIcon>
                              <RadioButtonUnchecked fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={title} />
                            {subSubMenu &&
                              (selectedIndex === index && open ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              ))}
                          </ListItemButton>
                          {subSubMenu && (
                            <Collapse
                              in={selectedIndex === index && openSubMenu}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List component="div" disablePadding>
                                {subSubMenu.map(({ title, path }, index) => {
                                  return (
                                    <ListItemButton
                                      selected={path === router.asPath}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleListItemClick(
                                          event,
                                          index,
                                          path,
                                          selectedIndex
                                        );
                                      }}
                                      sx={{ pl: 5 }}
                                      key={`submenu-${index}`}
                                    >
                                      <ListItemIcon>
                                        <RadioButtonUnchecked fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary={title} />
                                    </ListItemButton>
                                  );
                                })}
                              </List>
                            </Collapse>
                          )}
                        </Fragment>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Fragment>
          );
        })}
      </List>
    </Container>
  );
}

const Container = styled.div`
  ${({ theme, shrink }) => `
    padding: ${shrink ? theme.spacing(3, 2, 2) : theme.spacing(3)};
    border-right: 1px solid ${theme.colors.palette.lightGrey};
    transition: 0.3s ease all;
    flex: 0 0 300px;
    transform: ${!shrink ? "translate(-100%)" : "translate(0)"};
    max-width: calc(100vw - 50px);
    width: 300px;
    background: ${theme.colors.palette.white};
    position: relative;
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 99;
    top: 0;
    bottom: 0;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      position: relative;
      transform: translate(0);
      flex: ${shrink ? "0 0 75px" : "0 0 300px"};
      max-width: 300px;

      .MuiListItemButton-root {
        > .MuiListItemText-root {
          display: ${shrink ? "none" : "block"};
        }
      }

      .MuiCollapse-root {
        .MuiButtonBase-root {
          &.Mui-selected {
            background-color: transparent;
          }
        }

        ${
          shrink &&
          `
        position: fixed;
        left: 100%;
        background: ${theme.colors.palette.white};
        filter: drop-shadow(0px 2px 8px rgba(0,0,0,0.32));
        border-radius: 10px;
        margin-top: -45px;
        width: 200px;
        padding: ${theme.spacing(1)};

        .MuiButtonBase-root {
          padding-left: ${theme.spacing(1)};
          margin-bottom: calc(${theme.spacing(1)} - 6px);

          .MuiTypography-root {
            font-size: 16px;
          }
        }

        &::before {
          content: "";
          display: block;
          position: absolute;
          top: 15px;
          left: -4px;
          width: 10px;
          height: 10px;
          background-color: ${theme.colors.palette.white};
          transform: translateY(-50%) rotate(232deg);
          z-index: 0;
        }`
        }

        .MuiListItemButton-root {
          > .MuiListItemText-root {
            display: block;
          }
        }
      }
    }

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      flex: ${shrink ? "0 0 75px" : "0 0 335px"};
      max-width: 335px;
      padding: ${shrink ? theme.spacing(3, 2, 2) : theme.spacing(3, 4, 4)};
    }

    .MuiList-root {
      overflow: auto;
      flex: 1;

      &::-webkit-scrollbar {
        width: 0;
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: transparent;
        outline: 0;
      }
    }

    .MuiListItemButton-root {
      height: 50px;
      border-radius: 10px;
      margin-bottom: ${theme.spacing(1)};

      .MuiTypography-root {
        font-size: 16px;

        @media (min-width: ${theme.breakpoints.values.lg}px) {
          font-size: 18px;
        }
      }

      .MuiListItemIcon-root .MuiSvgIcon-root,
      .MuiSvgIcon-root {
        color: ${theme.colors.palette.grayishBlue};
      }

      > .MuiSvgIcon-root {
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: ${shrink ? "none" : "block"};
        }
      }

      &.Mui-selected {
        .MuiTypography-root {
          color: ${theme.colors.palette.orange};
        }

        .MuiListItemIcon-root,
        .MuiSvgIcon-root {
          color: ${theme.colors.palette.orange};
        }
      }

      .MuiListItemIcon-root {
        min-width: 40px;

        @media (min-width: ${theme.breakpoints.values.md}px) {
          min-width: ${shrink ? "auto" : "40px"};
        }
      }
    }

    .MuiCollapse-vertical {
      .MuiListItemIcon-root {
        min-width: 25px;
      }

      .MuiTypography-root {
        color: ${theme.colors.palette.darkGrey};
      }

      .MuiListItemIcon-root {
        color: ${theme.colors.palette.darkGrey};

        .MuiSvgIcon-fontSizeSmall {
          font-size: 14px;
        }
      }
    }
  `}
`;

const ListItem = styled(ListItemButton)`
  ${({ theme, activestate }) => `
    &.MuiButtonBase-root {
      ${
        activestate &&
        `background-color: rgba(0, 55, 150, 0.80);
         
        .MuiTypography-root {
          color: ${theme.colors.palette.orange};
        }

        .MuiSvgIcon-root {
          color: ${theme.colors.palette.orange};
         }

        .MuiListItemIcon-root {
          .MuiSvgIcon-root {
            color: ${theme.colors.palette.orange};
           }
        }
       `
      }
    }
  `}
`;

const MuiIconButton = styled(IconButton)`
  ${({ theme, shrink }) => `
    &.MuiIconButton-root {
      width: 50px;
      height: 50px;
      color: ${theme.colors.palette.black};
      background: ${theme.colors.palette.white};
      border: 1px solid ${theme.colors.palette.lightGrey};
      position: absolute;
      top: 18px;
      right: ${!shrink ? "-40px" : 0};
      transform: translateX(50%);
      filter: drop-shadow(8px 0px 25px ${theme.colors.palette.lightGrey});

      @media (min-width: ${theme.breakpoints.values.md}px) {
        top: 24px;
        right: 0;
      }
    }
  `}
`;

const LogoContainer = styled.div`
  ${({ theme, shrink }) => `
    margin-bottom: ${theme.spacing(4)};
    transition: 0.3s ease all;
    overflow: hidden;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      width: ${shrink ? "40px" : "176px"};
    }
  `}
`;
