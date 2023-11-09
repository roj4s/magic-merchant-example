import Home from "./layouts/home";
import OrderInfo from "./layouts/order-info";

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
];

export default routes;
