import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOCALSTORAGE_KEY } from ".";
import env from "react-dotenv";
import axios from "axios";

const data = {
  purchases: [],
  loading: false,
  error: null,
  loadingId: null,
  errorRequestRefund: null,
};

const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
  ?.purchases ?? { data: { ...data } };

export const getPurchases = createAsyncThunk(
  "subscription/get_purchases",
  async (data, { rejectWithValue }) => {
    return await axios
      .get(`${env.API_URL}/api/purchases/${data.auth_token}`)
      .catch((e) => rejectWithValue(e.response.data));
  }
);

export const requestRefund = createAsyncThunk(
  "subscription/request_refund",
  async (data, { rejectWithValue }) => {
    return await axios
      .post(
        `${env.API_URL}/api/refund/${data.auth_token}/${data.transaction_uuid}`
      )
      .then((resp) => {
        console.log("req done", resp);
        if (resp.status === 201 || resp.status === 200) return data;
        return rejectWithValue({ error: "unknown" });
      })
      .catch((e) => rejectWithValue(e.response.data));
  }
);

export const setRefundStatus = createAsyncThunk(
  "subscription/set_refund_status",
  async (data, { rejectWithValue }) => {
    return await axios
      .post(`${env.API_URL}/api/setrefundstatus`, data)
      .then((resp) => {
        console.log("req done", resp);
        if (resp.status === 201 || resp.status === 200) return data;
        return rejectWithValue({ error: "unknown" });
      })
      .catch((e) => rejectWithValue(e.response.data));
  }
);

export const transferRefund = createAsyncThunk(
  "subscription/transer_refund",
  async (data, { rejectWithValue }) => {
    return await axios
      .post(`${env.API_URL}/api/initiaterefund`, data)
      .then((resp) => {
        console.log("req done", resp);
        if (resp.status === 201 || resp.status === 200) return data;
        return rejectWithValue({ error: "unknown" });
      })
      .catch((e) => rejectWithValue(e.response.data));
  }
);

export const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    setLoadingId: (state, action) => {
      state.data.loadingId = action.payload;
    },
  },
  extraReducers(builder) {
    // >>> Get Purchases
    builder.addCase(getPurchases.fulfilled, (state, action) => {
      console.log(action.payload);
      state.data = {
        ...state.data,
        loading: false,
        purchases: action.payload.data,
        error: null,
      };
    });
    builder.addCase(getPurchases.pending, (state, action) => {
      state.data = {
        ...state.data,
        loading: true,
        purchases: [],
        error: null,
      };
    });
    builder.addCase(getPurchases.rejected, (state, action) => {
      state.data = {
        ...state.data,
        loading: false,
        purchases: [],
        error: action.payload.error,
      };
    });
    // <<<< Get Purchases
    //
    // >>>>> Request Refund
    builder.addCase(requestRefund.fulfilled, (state, action) => {
      console.log("request full", action.payload);
      state.data = {
        ...state.data,
        loadingId: null,
        erroRequestRefund: null,
        purchases: state.data.purchases.map((p) =>
          p.transaction_uuid === action.payload.transaction_uuid
            ? { ...p, refund: { status: "pending" } }
            : p
        ),
      };
    });
    builder.addCase(requestRefund.pending, (state, action) => {
      state.data = {
        ...state.data,
        errorRequestRefund: null,
      };
    });
    builder.addCase(requestRefund.rejected, (state, action) => {
      state.data = {
        ...state.data,
        errorRequestRefund: action.payload.error,
        loadingId: null,
      };
    });
    // <<<<< Request Refund

    // >>>>> Refund Status
    builder.addCase(setRefundStatus.fulfilled, (state, action) => {
      state.data = {
        ...state.data,
        loadingId: null,
        erroRequestRefund: null,
        purchases: state.data.purchases.map((p) =>
          p.transaction_uuid === action.payload.transaction_uuid
            ? { ...p, refund: { status: action.payload.status } }
            : p
        ),
      };
    });
    builder.addCase(setRefundStatus.pending, (state, action) => {
      state.data = {
        ...state.data,
        errorRequestRefund: null,
      };
    });
    builder.addCase(setRefundStatus.rejected, (state, action) => {
      state.data = {
        ...state.data,
        errorRequestRefund: action.payload.error,
        loadingId: null,
      };
    });
    // <<<<< Refund status

    // >>>>> Transfer Refund
    builder.addCase(transferRefund.fulfilled, (state, action) => {
      state.data = {
        ...state.data,
        loadingId: null,
        erroRequestRefund: null,
        purchases: state.data.purchases.map((p) =>
          p.transaction_uuid === action.payload.transaction_uuid
            ? { ...p, refund: { status: "refund done" } }
            : p
        ),
      };
    });
    builder.addCase(transferRefund.pending, (state, action) => {
      state.data = {
        ...state.data,
        errorRequestRefund: null,
      };
    });
    builder.addCase(transferRefund.rejected, (state, action) => {
      state.data = {
        ...state.data,
        errorRequestRefund: action.payload.error,
        loadingId: null,
      };
    });
    // <<<<< Transfer Refund
  },
});

export const { setLoadingId } = purchasesSlice.actions;
export default purchasesSlice.reducer;
