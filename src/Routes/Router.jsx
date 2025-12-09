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
import BoostPayment from "../Pages/Payment/BoostPayment";
import BoostSuccess from "../Pages/Payment/BoostSuccess";
import BoostCancel from "../Pages/Payment/BoostCancel";
import Profile from "../Pages/Home/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, 
    children: [
      { index: true, element: <Home /> },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {path:'/profile',element:<PrivateRoute><Profile/></PrivateRoute>},

      { path: "/reportIssue", element: <ReportIssue /> },

      { path: "/all-issues", element: <AllIssues /> },

      {
        path: "/my-issues",
        element: (
          <PrivateRoute>
            <MyIssues />
          </PrivateRoute>
        ),
      },

      {
        path: "/viewDetails/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },

      {
        path: "/boost-payment/:issueId",
        element: (
          <PrivateRoute>
            <BoostPayment />
          </PrivateRoute>
        ),
      },

      {
        path: "/boost-success",
        element: <BoostSuccess />,
      },

      {
        path: "/boost-cancel",
        element: <BoostCancel />,
      },
    ],
  },
]);

export default router;
