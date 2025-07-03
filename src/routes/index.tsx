import type { RouteObject } from "react-router-dom";
import RouteErrorPage from "../components/error/error";
import EditItemsRoute from "./EditItems";
import HistoryRoute from "./History";
import HomeRoute from "./Home";
import InstanceRoute from "./Instance";

const routes = [
  {
    index: true,
    errorElement: <RouteErrorPage />,
    element: <HomeRoute />,
  },
  {
    path: ":instanceId",
    children: [
      {
        index: true,
        element: <InstanceRoute />,
      },
      {
        path: "edit",
        element: <EditItemsRoute />,
      },
      {
        path: "history",
        element: <HistoryRoute />,
      },
    ],
  },
] satisfies RouteObject[];

export default routes;
