import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Blogs from "../pages/Blogs";
import AboutUs from "../pages/AboutUs";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreatePost from "../pages/CreatePost";
import EditPost from "../pages/EditPost";
import PostDetail from "../pages/PostDetail";
import Contact from "../pages/Contact";
import SuperAdminUsers from "../pages/SuperAdminUsers";
import UserDetails from "../pages/UserDetails";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blogs", element: <Blogs /> },
      { path: "about", element: <AboutUs /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-service", element: <TermsOfService /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "create", element: <CreatePost /> },
      { path: "edit/:id", element: <EditPost /> },
      { path: "post/:id", element: <PostDetail /> },
      { path: "contact", element: <ProtectedRoute><Contact /></ProtectedRoute> },
      { path: "superadmin/users", element: <SuperAdminUsers /> },
      { path: "superadmin/users/:id", element: <UserDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
