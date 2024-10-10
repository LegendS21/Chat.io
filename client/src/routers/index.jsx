import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Login from "../views/Login";
import { io } from "socket.io-client";
import Chat from "../views/Chat";
import AddRoom from "../views/AddRoom";
const url = "http://localhost:3000";
const socket = io("http://localhost:3000", {
  autoConnect: false,
});
const router = createBrowserRouter([
  {
    path: "*",
    loader: () => {
      return redirect("/login");
    },
  },
  {
    path: "/login",
    element: <Login socket={socket} />,
    loader: () => {
      if (localStorage.username) {
        return redirect("/chat");
      }
      return null;
    },
  },
  {
    path: "/chat",
    element: <Chat socket={socket} url={url} />,
    loader: () => {
      if (!localStorage.username) {
        return redirect("/login");
      }
      return null;
    },
  },
  {
    path: "/addRoom",
    element: <AddRoom socket={socket} url={url} />,
    loader: () => {
      if (!localStorage.username) {
        return redirect("/login");
      }
      return null;
    },
  },
]);
export default router;
