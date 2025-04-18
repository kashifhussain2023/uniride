import colors from "./colors";
const fontFamily = "'Encode Sans', sans-serif";

const typography = {
  htmlFontSize: 16,
  fontFamily,
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontFamily,
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: "52px",
    color: colors.palette.black
    
  },
  h2: {
    fontFamily,
    fontSize: "24px",
    fontWeight: 400,
    lineHeight: "1.1",
    color: colors.palette.black
  },
  h3: {
    fontFamily,
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "32px",
    color: colors.palette.black
  },
  h4: {
    fontFamily,
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "24px",
    color: colors.palette.black
  },
  h5: {
    fontFamily,
    fontWeight: 400,
    fontSize: "1.5rem",
    lineHeight: 1.334,
    color: colors.palette.black
  },
  h6: {
    fontFamily,
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.6,
    color: colors.palette.black
  },
  subtitle1: {
    fontFamily,
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.75,
    color: colors.palette.darkGrey
  },
  subtitle2: {
    fontFamily,
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.57,
    color: colors.palette.black
  },
  subtitle3: {
    fontFamily,
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: colors.palette.black
  },
  body1: {
    fontFamily,
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.5,
    color: colors.palette.black
  },
  body2: {
    fontFamily,
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.5,
    color: colors.palette.black
  },
  button: {
    fontFamily,
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.75
  },
  caption: {
    fontFamily,
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.66
  },
  overline: {
    fontFamily,
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 2.66,
    textTransform: "uppercase"
  },

  success: {
    fontFamily,
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: 1,
    color: colors.palette.green
  },

  cancel: {
    fontFamily,
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: 1,
    color: colors.palette.red
  }



};

export default typography;
