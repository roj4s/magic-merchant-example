import Home from "./layouts/home";
import OrderInfo from "./layouts/order-info";
import Refund from "./layouts/refund";
import VerifyUserPage from "./layouts/verify_user";

const routes = [
  {
    name: "Home",
    key: "home",
    route: "/home",
    component: <Home />,
  },
  {
    name: "OrderInfo",
    key: "order_info",
    route: "/order-info",
    component: <OrderInfo />,
  },
  {
    name: "VerifuYser",
    key: "verify_user",
    route: "/verify-user",
    component: <VerifyUserPage />,
  },
  {
    name: "Refund",
    key: "refund",
    route: "/refund",
    component: <Refund />,
  },
];

export default routes;
