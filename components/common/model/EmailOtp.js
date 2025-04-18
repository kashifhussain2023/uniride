import { useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import CustomFormControl from "@/theme/CustomFormControl";
import { api } from "@/utils/api/common";
import { validateProfileEmail } from "@/utils/api/profile-email-otp";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import SpinnerLoader from "../SpinnerLoader";

const EmailOtp = ({ open, handleClose, userAuth }) => {
  const router = useRouter();
  const [removeErrors, setRemoveErrors] = useState(false);
  const [inputs, setInputs] = useState({});
  const [disabledEmail, setDisabledEmail] = useState(false);
  const [disabledOtp, setDisabledOtp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });
  const [otpError, setOtpError] = useState("");
  const handleModelClose = () => {
    setDisabledEmail(false);
    setDisabledOtp(true);
    setInputs({
      email: "",
      otp: "",
    });
    handleClose();
  };
  const handleInputChange = ({ target }) => {
    // Handle other input types
    setOtpError("");
    setInputs((inputs) => ({
      ...inputs,
      [target.name]: target.value,
    }));
    if (removeErrors) {
      var data = { ...inputs, [target.name]: target.value };
      setErrors({
        ...validateProfileEmail({
          ...data,
        }),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var noOtpErrors = true;
    const isOtpValid = inputs.otp;
    if (!isOtpValid || isOtpValid.trim() === "") {
      noOtpErrors = false;
      setOtpError("Otp field is required");
    }
    if (noOtpErrors) {
      setLoading(true);
      const formData1 = new FormData();
      formData1.append("token_code", userAuth?.token_code);
      formData1.append("otp", isOtpValid);
      formData1.append("new_email", inputs.email);

      // return;
      const response = await api({
        url: "/customers/verfity_new_email",
        method: "POST",
        data: formData1,
      });

      if (response.status === true) {
        setLoading(false);
        handleClose();
        toast.success(response.message);
        await signOut({ redirect: false });
        router.push("/login");
      } else if (response.status === false) {
        setLoading(false);
        toast.error(response.message);
      } else {
        setLoading(false);
        toast.error("Internal Server Error");
      }
    }
  };
  const sendOtp = async (e) => {
    e.preventDefault();

    let inputForValidation = {
      email: inputs.email,
    };
    const validationErrors = validateProfileEmail(inputForValidation);

    const noErrors = Object.keys(validationErrors).length === 0;

    setRemoveErrors(true);
    if (noErrors) {
      setLoading(true);
      const formData = new FormData();
      formData.append("customer_id", userAuth?.customer_id);
      formData.append("token_code", userAuth?.token_code);
      formData.append("new_email", inputs.email);
      const response = await api({
        url: "/customers/update_customer_email",
        method: "POST",
        data: formData,
      });

      if (response.status === true) {
        setLoading(false);
        toast.success(response.message);
        setDisabledEmail(true);
        setDisabledOtp(false);
      } else if (response.status === false) {
        setLoading(false);
        toast.error(response.message);
      } else {
        setLoading(false);
        toast.error("Internal Server Error");
      }
    } else {
      setErrors(validationErrors);
    }
  };
  return (
    <>
      <SpinnerLoader loading={loading} />
      <BootstrapDialog
        onClose={handleModelClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth={500}
      >
        <IconButton
          aria-label="close"
          onClick={handleModelClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <RightSection>
            <FormControl style={{ display: disabledEmail ? "none" : "block" }}>
              <InputLabel>Enter New Email</InputLabel>
              <CustomFormControl
                fullWidth
                type="text"
                placeholder="Enter email"
                value={inputs.email || ""}
                name="email"
                onChange={handleInputChange}
              />
              <span style={{ color: "red" }}>{errors && errors.email}</span>
            </FormControl>
            <FormControl style={{ display: disabledOtp ? "none" : "block" }}>
              <InputLabel>Enter Otp</InputLabel>
              <CustomFormControl
                fullWidth
                type="text"
                placeholder="Enter otp"
                value={inputs.otp || ""}
                name="otp"
                onChange={handleInputChange}
              />
              <span style={{ color: "red" }}>{otpError || ""}</span>
            </FormControl>
            <Button
              variant="contained"
              fullWidth
              onClick={sendOtp}
              style={{ display: disabledEmail ? "none" : "flex" }}
            >
              Send Otp
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              style={{ display: disabledOtp ? "none" : "flex" }}
            >
              Update Email
            </Button>
          </RightSection>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default EmailOtp;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "&.MuiModal-root": {
    zIndex: 10,
  },
  "& .MuiPaper-root": {
    maxWidth: 500,
    borderRadius: 24,
    padding: theme.spacing(1),
  },

  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    background: theme.colors.palette.lightGrey,
    borderRadius: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  "& .MuiIconButton-root": {
    right: 24,
    top: 25,
    zIndex: 99,
    color: theme.colors.palette.black,
    fontSize: 30,
  },

  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

`}
`;
const RightSection = styled("div")`
  ${({ theme }) => `
    width: 100%;
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
  `}
`;

const FormControl = styled("div")`
  ${({ theme }) => `
    margin-bottom: 10px;
    .MuiInputBase-input {
      font-size: 16px;
      height: 30px;
      padding: 5px 10px;
      border-radius: 6px;
    }
    .MuiInputLabel-root {
      margin-top: 0px;
      display: block;
      margin-bottom: 5px;
      color: ${theme.colors.palette.darkGrey};
      span {
        color: ${theme.colors.palette.red};
      }
    }
  `}
`;
