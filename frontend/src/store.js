import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./reducers/order";
import userReducer from "./reducers/user";
import purchaseReducer from "./reducers/purchases";

export default configureStore({
  reducer: {
    order: orderReducer,
    user: userReducer,
    purchases: purchaseReducer,
  },
});
