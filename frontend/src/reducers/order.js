import { createSlice } from "@reduxjs/toolkit";
import { LOCALSTORAGE_KEY } from ".";
import { getValidObjectId } from ".";

const newUUid = getValidObjectId();

const newOrderState = {
  _id: newUUid,
  products: {},
  total: 0,
};

const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
  ?.order ?? {
  orders: {
    [newUUid]: { ...newOrderState },
  },

  activeOrder: newUUid,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.orders[state.activeOrder].products[action.payload._id] =
        action.payload;

      state.orders[state.activeOrder].total +=
        action.payload.quantity * action.payload.price;

      if (
        action.payload.quantity === 0 &&
        action.payload._id in state.orders[state.activeOrder].products
      ) {
        delete state.orders[state.activeOrder].products[action.payload._id];
      }
    },
    clear: (state) => {
      state.orders[state.activeOrder].products = [];
    },
    clearAllButCurrent: (state) => {
      [...Object.keys(state.orders)].forEach((orderId) => {
        if (orderId !== state.activeOrder) {
          delete state.orders[orderId];
        }
      });
    },
    updateCurrentOrder: (state, action) => {
      state.orders[state.activeOrder] = {
        ...state.orders[state.activeOrder],
        ...action.payload,
      };
    },
  },
});

export const { addProduct, clear, updateCurrentOrder, clearAllButCurrent } =
  orderSlice.actions;

export default orderSlice.reducer;
