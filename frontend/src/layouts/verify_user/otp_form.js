import { Box, Button, Input, Typography } from "@mui/joy";
import { createRef, useEffect, useState } from "react";
import { currentTheme } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import { sendPhone, setOtp, verifyCode } from "../../reducers/user";

export default function OtpForm({ length = 6 }) {
  const [codeList, setCodeList] = useState([...Array(length)]);
  const disp = useDispatch();
  const otpData = useSelector((state) => state.user.otp_validation);

  const refs = [...Array(length)].map(() => createRef(null));

  const focusNext = (i) => {
    if (i !== length - 1) {
      const input = refs[i + 1].current.getElementsByTagName("input")[0];

      input.focus();
    }
  };

  useEffect(() => {
    return () => {
      disp(setOtp({ error_otp: null }));
    };
  }, [disp]);

  useEffect(() => {
    const code = codeList.join("");
    if (code.length === length) {
      disp(verifyCode({ otp: code, phone: otpData.phone }));
    }
  }, [codeList, disp, length, otpData.phone]);

  return (
    <Box
      sx={{
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography level="body-sm">
          <b>Please enter the code sent to {otpData.phone}</b>
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {[...Array(length)].map((_, i) => {
            return (
              <Input
                ref={refs[i]}
                key={i}
                value={codeList[i] || ""}
                onChange={(evt) =>
                  setCodeList(
                    codeList.map((n, k) => {
                      if (k === i) {
                        const value = evt.target.value.at(
                          evt.target.value.length - 1
                        );
                        if (!value || value.trim() === "") return "";
                        if (/^\d+$/.test(value)) {
                          focusNext(i);
                          return value;
                        }
                      }
                      return n;
                    })
                  )
                }
              />
            );
          })}
        </Box>
      </Box>
      {otpData.error_otp && (
        <Typography level="body-sm" color="warning">
          <b>{otpData.error_otp}</b>
        </Typography>
      )}
      {otpData.auth_token && (
        <Typography color="success" level="body-sm">
          <b>Verification done</b>
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
        loading={otpData.sending_phone || otpData.verifying_code}
      >
        Resend code
      </Button>
    </Box>
  );
}
