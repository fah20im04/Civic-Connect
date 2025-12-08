import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/AuthPages/Login";
import Register from "../Pages/AuthPages/Register";
import ReportIssue from "../Pages/Issues/ReportIssue";
import MyIssues from "../Pages/Issues/MyIssues";
import IssueDetails from "../Pages/Issues/IssueDetails";
import PrivateRoute from "./PrivateRoute";
import AllIssues from "../Pages/Issues/AllIssues";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/reportIssue",
        element: <ReportIssue></ReportIssue>,
      },
      {
        path: '/all-issues',
        element:<AllIssues></AllIssues>
      },
      {
        path: "/my-issues",
        element: (
          <PrivateRoute>
            <MyIssues></MyIssues>,
          </PrivateRoute>
        ),
      },
      {
        path: "/viewDetails/:id",
        element: (
          <PrivateRoute>
            <IssueDetails></IssueDetails>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
