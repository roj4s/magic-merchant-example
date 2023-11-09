import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./reducers/order";
import userReducer from "./reducers/user";

export default configureStore({
  reducer: {
    order: orderReducer,
    user: userReducer,
  },
});
