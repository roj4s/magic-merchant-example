import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { sendPhone } from "../../reducers/user";
import { currentTheme } from "../../theme";
import { setOtp } from "../../reducers/user";
import { useEffect } from "react";

export default function VerifyUserPhoneForm() {
  const otpData = useSelector((state) => state.user.otp_validation);
  const disp = useDispatch();

  useEffect(() => {
    return () => {
      disp(setOtp({ error_phone: null }));
    };
  }, [disp]);

  return (
    <Box
      sx={{
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <FormControl>
        <FormLabel>Please enter your phone number</FormLabel>
        <Input
          value={otpData.phone || ""}
          onChange={(evt) =>
            disp(setOtp({ ...otpData, phone: evt.target.value }))
          }
        />
      </FormControl>
      {otpData.error_phone && (
        <Typography level="body-sm" color="warning">
          <b>{otpData.error_phone}</b>
        </Typography>
      )}
      <Button
        sx={{
          backgroundColor: currentTheme.colors.secondary,
          "&:hover": {
            backgroundColor: currentTheme.colors.secondaryLighter,
          },
        }}
        onClick={() => disp(sendPhone(otpData.phone))}
        loading={otpData.sending_phone}
      >
        Send code
      </Button>
    </Box>
  );
}
