import colors from "./colors";
import spacing from "./spacing";

const MuiButton = {
  styleOverrides: {
    root: {
      border: `1px solid ${colors.palette.dGray}`,
      borderRadius: "4px",
      fontSize: "16px",
      fontWeight: 400,
      height: "50px",
      // minWidth: "100%",
      "@media (min-width: 960px)": {
        minWidth: "120px",
      },
      padding: `${spacing[2]}px`,
      textTransform: "none",
    },
    contained: {
      boxShadow: "none",
      backgroundColor: `${colors.palette.dGray}`,
      "&:active": {
        boxShadow: "none",
      },
      "&:hover": {
        boxShadow: "none",
      },
      "&.Mui-disabled": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
    },
    containedSizeSmall: {
      fontSize: "16px",
      padding: `0 ${spacing[2]}px`,
    },
    containedSizeLarge: {
      fontSize: "16px",
      padding: `${spacing[2]}px`,

      "@media (min-width: 960px)": {
        minWidth: "338px",
      },
    },
    containedPrimary: {
      "&:hover": {
        backgroundColor: colors.palette.orange,
        border: `1px solid ${colors.palette.white}`,
      },
    },
    secondaryPrimary: {
      backgroundColor: colors.palette.orange,
      color: colors.palette.white,
      border: 0,

      "&:hover": {
        backgroundColor: colors.palette.dGray,
        boxShadow: "0 4px 10px rgba(0, 0, 0, .25)",

        "@media (hover: none)": {
          backgroundColor: colors.palette.dGray,
        },
      },
    },
    outlinedSizeSmall: {
      fontSize: "14px",
      padding: `${spacing[2]}px`,
      height: "36px",
    },
    outlinedSizeLarge: {
      fontSize: "16px",
      padding: `0 ${spacing[2]}px`,
      "@media (min-width: 960px)": {
        minWidth: "338px",
      },
    },
    text: {
      minWidth: "inherit",
      padding: 0,
      backgroundColor: "red",
    },
    textPrimary: {
      color: `${colors.palette.darkOrange}`,
    },
    outlinedPrimary: {
      border: `1px solid ${colors.palette.darkOrange}`,
      padding: `${spacing[2]}px`,
      color: `${colors.palette.darkOrange}`,

      "&:hover": {
        border: `1px solid ${colors.palette.darkOrange}`,
        backgroundColor: colors.palette.darkOrange,
        color: colors.palette.white,

        "@media (hover: none)": {
          backgroundColor: colors.palette.darkOrange,
        },
      },
    },
    outlinedSecondary: {
      border: `1px solid ${colors.palette.dGray}`,
      padding: `${spacing[2]}px`,
      color: `${colors.palette.dGray}`,

      "&:hover": {
        border: `1px solid ${colors.palette.orange}`,
        backgroundColor: colors.palette.orange,
        color: colors.palette.white,

        "@media (hover: none)": {
          backgroundColor: colors.palette.orange,
        },
      },
    },
    containedError: {
      backgroundColor: colors.palette.red,
      borderColor: colors.palette.red,
    },
    text: {
      border: "none",
      fontWeight: 400,
      height: "auto",
      padding: `${spacing[2]}px 0`,
    },
    textSizeSmall: {
      fontSize: "16px",
      fontWeight: 400,
      textAlign: "left",
      lineHeight: 1.5,
      padding: 0,
      minWidth: 0,
    },
    textSizeLarge: {
      fontSize: "16px",
      fontWeight: 400,
      textAlign: "left",
      lineHeight: 1.5,
      padding: 0,
      minWidth: 0,
    },
    textPrimary: {
      color: colors.palette.mauve,
      "&:hover": {
        backgroundColor: colors.palette.white,
        textDecoration: "underline",
      },
    },
    endIcon: {
      marginLeft: "-4px",
    },
    iconSizeSmall: {
      "& > *:first-child": {
        fontSize: "24px",
      },
    },
    iconSizeLarge: {
      "& > *:first-child": {
        fontSize: "30px",
      },
    },
  },
};

export default MuiButton;
