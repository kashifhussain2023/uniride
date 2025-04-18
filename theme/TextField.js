import { shadows } from "@mui/system";
import colors from "./colors";

const FormTextField = {
  styleOverrides: {
    root: {
      ".MuiInputBase-sizeSmall": {
        fontSize: 14,
        height: 25,
        padding: 0,
      },

      ".MuiInputLabel-root": {
        fontSize: 14,
      },

      ".MuiOutlinedInput-notchedOutline": {
        borderColor: `${colors.palette.darkerGray}`,
      },

      ".outlined": {
        ".MuiInputBase-input": { fontSize: 14, height: 36, padding: 0 },
      },
    },
  },
};

export default FormTextField;
