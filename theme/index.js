import { createTheme } from '@mui/material/styles';
import breakPoints from './muiBreakpoints';
import colors from './colors';
import MuiButton from './MuiButton';
import MuiTextField from './muiTextField';
import palette from './palette';
import spacing from './spacing';
import typography from './typography';
const overrides = {
  breakPoints,
  colors,
  components: {
    MuiButton,
    MuiTextField,
  },
  palette,
  spacing,
  typography,
};
const theme = createTheme(overrides);
export default theme;
