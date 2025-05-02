import colors from './colors';
import spacing from './spacing';

const MuiButton = {
  styleOverrides: {
    contained: {
      '&.Mui-disabled': {
        borderColor: 'rgba(0, 0, 0, 0.12)',
      },
      '&:active': {
        boxShadow: 'none',
      },
      '&:hover': {
        boxShadow: 'none',
      },
      backgroundColor: `${colors.palette.dGray}`,
      boxShadow: 'none',
    },
    containedError: {
      backgroundColor: colors.palette.red,
      borderColor: colors.palette.red,
    },
    containedPrimary: {
      '&:hover': {
        backgroundColor: colors.palette.orange,
        border: `1px solid ${colors.palette.white}`,
      },
    },
    containedSizeLarge: {
      '@media (min-width: 960px)': {
        minWidth: '338px',
      },
      fontSize: '16px',
      padding: `${spacing[2]}px`,
    },
    containedSizeSmall: {
      fontSize: '16px',
      padding: `0 ${spacing[2]}px`,
    },
    endIcon: {
      marginLeft: '-4px',
    },
    iconSizeLarge: {
      '& > *:first-child': {
        fontSize: '30px',
      },
    },
    iconSizeSmall: {
      '& > *:first-child': {
        fontSize: '24px',
      },
    },
    outlinedPrimary: {
      '&:hover': {
        '@media (hover: none)': {
          backgroundColor: colors.palette.darkOrange,
        },
        backgroundColor: colors.palette.darkOrange,
        border: `1px solid ${colors.palette.darkOrange}`,
        color: colors.palette.white,
      },
      border: `1px solid ${colors.palette.darkOrange}`,
      color: `${colors.palette.darkOrange}`,
      padding: `${spacing[2]}px`,
    },
    outlinedSecondary: {
      '&:hover': {
        '@media (hover: none)': {
          backgroundColor: colors.palette.orange,
        },
        backgroundColor: colors.palette.orange,
        border: `1px solid ${colors.palette.orange}`,
        color: colors.palette.white,
      },
      border: `1px solid ${colors.palette.dGray}`,
      color: `${colors.palette.dGray}`,
      padding: `${spacing[2]}px`,
    },
    outlinedSizeLarge: {
      '@media (min-width: 960px)': {
        minWidth: '338px',
      },
      fontSize: '16px',
      padding: `0 ${spacing[2]}px`,
    },
    outlinedSizeSmall: {
      fontSize: '14px',
      height: '36px',
      padding: `${spacing[2]}px`,
    },
    root: {
      '@media (min-width: 960px)': {
        minWidth: '120px',
      },
      border: `1px solid ${colors.palette.dGray}`,
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 400,
      height: '50px',
      padding: `${spacing[2]}px`,
      textTransform: 'none',
    },
    secondaryPrimary: {
      '&:hover': {
        '@media (hover: none)': {
          backgroundColor: colors.palette.dGray,
        },
        backgroundColor: colors.palette.dGray,
        boxShadow: '0 4px 10px rgba(0, 0, 0, .25)',
      },
      backgroundColor: colors.palette.orange,
      border: 0,
      color: colors.palette.white,
    },
    text: {
      border: 'none',
      fontWeight: 400,
      height: 'auto',
      padding: `${spacing[2]}px 0`,
    },
    textPrimary: {
      '&:hover': {
        backgroundColor: colors.palette.white,
        textDecoration: 'underline',
      },
      color: colors.palette.mauve,
    },
    textSizeLarge: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      minWidth: 0,
      padding: 0,
      textAlign: 'left',
    },
    textSizeSmall: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      minWidth: 0,
      padding: 0,
      textAlign: 'left',
    },
  },
};

export default MuiButton;
