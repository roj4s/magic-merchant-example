import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import env from "react-dotenv";
import { LOCALSTORAGE_KEY } from ".";
import { getValidObjectId } from ".";

const newOrderState = {
  _id: getValidObjectId(),
  name: "",
  phone: "",
  address: "",
  otp_validation: {
    sending_phone: false,
    auth_token: null,
    phone: null,
    verifying_code: false,
    error_phone: null,
    error_otp: null,
  },
};

const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
  ?.user ?? {
  ...newOrderState,
};

export const sendPhone = createAsyncThunk("user/send_code", async (phone) => {
  const resp = await axios.get(`${env.API_URL}/api/send_code/${phone}`);

  return { resp, phone };
});

export const verifyCode = createAsyncThunk(
  "user/verify_code",
  async (data, { rejectWithValue }) => {
    return await axios
      .get(`${env.API_URL}/api/verify_code/${data.phone}/${data.otp}`)
      .catch((e) => rejectWithValue(e.response.data));
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return { ...action.payload, _id: state._id };
    },
    setOtp: (state, action) => {
      state.otp_validation = { ...state.otp_validation, ...action.payload };
    },
    clear: () => {
      return { ...newOrderState, _id: getValidObjectId() };
    },
  },
  extraReducers(builder) {
    builder.addCase(sendPhone.fulfilled, (state, action) => {
      state.otp_validation = {
        phone_sent: true,
        sending_phone: false,
        phone: action.payload.phone,
        verifying_code: false,
        auth_token: null,
        error_phone: null,
        error_otp: null,
      };
    });

    builder.addCase(sendPhone.pending, (state, action) => {
      state.otp_validation = {
        phone_sent: false,
        sending_phone: true,
        phone: state.otp_validation.phone,
        verifying_code: false,
        auth_token: null,
        error_phone: null,
        error_otp: null,
      };
    });

    builder.addCase(sendPhone.rejected, (state, action) => {
      console.log(action.error);
      let error = "Coudn't send OTP, verify the phone entered";
      if (action.error.message.includes("429")) {
        error = "Too many requests";
      }
      state.otp_validation = {
        phone_sent: false,
        sending_phone: false,
        phone: state.otp_validation.phone,
        verifying_code: false,
        auth_token: null,
        error_phone: error,
        error_otp: null,
      };
    });

    builder.addCase(verifyCode.fulfilled, (state, action) => {
      state.otp_validation = {
        phone_sent: true,
        sending_phone: false,
        phone: state.otp_validation.phone,
        verifying_code: false,
        auth_token: action.payload.data.data.auth_token,
        error_phone: null,
        error_otp: null,
      };
    });

    builder.addCase(verifyCode.pending, (state, action) => {
      state.otp_validation = {
        phone_sent: true,
        sending_phone: false,
        phone: state.otp_validation.phone,
        verifying_code: true,
        auth_token: null,
        error_phone: null,
        error_otp: null,
      };
    });

    builder.addCase(verifyCode.rejected, (state, action) => {
      console.log(action);
      let error = "Coudn't verify code";
      if (action.payload.error.includes("Max")) {
        error = "Max check attempts reached, please resend code";
      }
      if (action.payload.error.includes("not valid")) {
        error = action.payload.error;
      }
      if (action.payload.error.includes("not found")) {
        error =
          "No OTP code generated for given phone number, please click on Resend code button";
      }
      state.otp_validation = {
        phone_sent: true,
        sending_phone: false,
        phone: state.otp_validation.phone,
        verifying_code: false,
        auth_token: null,
        error_phone: null,
        error_otp: error,
      };
    });
  },
});

export const { setUserData, clear, setOtp } = userSlice.actions;

export default userSlice.reducer;
