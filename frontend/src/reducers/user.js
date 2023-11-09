import { createSlice } from "@reduxjs/toolkit";
import { LOCALSTORAGE_KEY } from ".";
import { getValidObjectId } from ".";

const newOrderState = {
  _id: getValidObjectId(),
  name: "",
  phone: "",
  address: "",
};

const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
  ?.user ?? {
  ...newOrderState,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return { ...action.payload, _id: state._id };
    },
    clear: () => {
      return { ...newOrderState, _id: getValidObjectId() };
    },
  },
});

export const { setUserData, clear } = userSlice.actions;

export default userSlice.reducer;
