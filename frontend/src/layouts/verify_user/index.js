import { Box } from "@mui/joy";
import { useSelector } from "react-redux";
import VerifyUserPhoneForm from "./user_phone_form";
import AppBar from "../../components/appbar";
import OtpForm from "./otp_form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyUserPage({ redirectTo }) {
  const otpData = useSelector((state) => state.user.otp_validation);
  const nav = useNavigate();

  useEffect(() => {
    if (redirectTo && otpData.auth_token) nav(redirectTo);
  }, [otpData.auth_token, redirectTo, nav]);

  return (
    <Box>
      <AppBar title="User verification" linkTo={"/"} />
      {!otpData.phone_sent ? (
        <VerifyUserPhoneForm />
      ) : (
        <OtpForm phone={otpData.phone} />
      )}
    </Box>
  );
}
