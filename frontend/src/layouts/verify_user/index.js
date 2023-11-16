import { Box } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import VerifyUserPhoneForm from "./user_phone_form";
import AppBar from "../../components/appbar";
import { setOtp } from "../../reducers/user";
import OtpForm from "./otp_form";

export default function VerifyUserPage() {
  const otpData = useSelector((state) => state.user.otp_validation);

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
