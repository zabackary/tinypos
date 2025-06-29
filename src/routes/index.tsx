import type { RouteObject } from "react-router-dom";
import NotFound from "../components/NotFound";
import EditItemsRoute from "./EditItems";
import HistoryRoute from "./History";
import HomeRoute from "./Home";
import InstanceRoute from "./Instance";

const routes = [
  {
    index: true,
    errorElement: <NotFound />,
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
