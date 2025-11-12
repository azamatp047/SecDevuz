import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login.tsx";
import ProtectedRoute from "./ProtectedRoutes.tsx";
import AppLayout from "../App.tsx";

// Admin sahifalar
import Dashboard from "../pages/admin/Dashboard.tsx";
import News from "../pages/admin/News.tsx";
import Team from "../pages/admin/Team.tsx";
import BlogForm from "../components/news-components/BlogForm.tsx";
import BlogDetail from "../pages/admin/BlogDetail.tsx";
import UseServicesList from "../components/service-components/UseServicesList.tsx";
import UseServiceDetail from "../components/service-components/UseServiceDetail.tsx";
import ServiceFormPage from "../components/service-components/ServiceForm.tsx";
import VacancyFormPage from "../components/vacancies-components/VacancyFormPage.tsx";
import VacancyDetail from "../components/vacancies-components/VacancyDetail.tsx";
import TeamMemberDetail from "../components/team-components/TeamMemberDetail.tsx";
import TeamForm from "../components/team-components/TeamForm.tsx";
import CertificateDetail from "../components/certificates-components/CertificateDetail.tsx";
import CertificateForm from "../components/certificates-components/CertificateForm.tsx";
import Uploads from "../pages/admin/Uploads.tsx";
import UsersList from "../pages/admin/UsersList.tsx";
import UsersDetail from "../components/users/UsersDetail.tsx";
import CommentsPage from "../pages/admin/Comments.tsx";
import ApplicationDetail from "../components/applications-components/ApplicationDetail.tsx";
import ServiceList from "../components/service-components/ServicesList.tsx";
import VacancyList from "../components/vacancies-components/VacancyList.tsx";
import ApplicationList from "../components/applications-components/ApplicationList.tsx";
import ProductsList from "../components/products-components/ProductsList.tsx";
import ProductsForm from "../components/products-components/ProductsForm.tsx";
import ProductDetail from "../components/products-components/ProductDetail.tsx";
import BuyProductsList from "../components/products-components/BuyProductsList.tsx";
import BuyProductDetail from "../components/products-components/BuyProductDetail.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "/users", element: <UsersList /> },
          { path: "/users/:id", element: <UsersDetail /> },
          { path: "/services", element: <ServiceList /> },
          { path: "/blog", element: <News /> },
          { path: "/blog/create", element: <BlogForm /> },
          { path: "/blog/:id", element: <BlogDetail /> },
          { path: "/blog/:id/edit", element: <BlogForm /> },
          { path: "/vacancies/admin", element: <VacancyList /> },
          { path: "/applications/admin", element: <ApplicationList /> },
          { path: "/vacancies/admin/create", element: <VacancyFormPage /> },
          { path: "/vacancies/admin/:id/edit", element: <VacancyFormPage /> },
          { path: "/vacancies/admin/:id", element: <VacancyDetail /> },
          { path: "/applications/admin/:id", element: <ApplicationDetail /> },
          { path: "/team/admin", element: <Team /> },
          { path: "/use-services", element: <UseServicesList />, },
          { path: "/use-services/:id", element: <UseServiceDetail />, },
          {
            path: "/services/create",
            element: <ServiceFormPage />,
          },
          {
            path: "/services/:id/edit",
            element: <ServiceFormPage />,
          },
          {
            path: "/team/admin/:id", // Team Member detail
            element: <TeamMemberDetail />,
          },
          {
            path: "/team/admin/create", // Team Member yaratish uchun TeamForm
            element: <TeamForm />,
          },
          {
            path: "/team/admin/:id/edit", // Team Member tahrirlash uchun TeamForm
            element: <TeamForm />,
          },
          {
            path: "/team/admin/certificates/:id", // Certificate detail
            element: <CertificateDetail />,
          },
          {
            path: "/team/admin/certificates/create", // Certificate yaratish uchun CertificateForm
            element: <CertificateForm />,
          },
          {
            path: "/team/admin/certificates/:id/edit", // Certificate tahrirlash uchun CertificateForm
            element: <CertificateForm />,
          },

          {
            path: "/uploads",
            element: <Uploads />,
          },

          {
            path: "/comments",
            element: <CommentsPage />,
          },

          {
            path: "/products/admin",
            element: <ProductsList />,
          },

          {
            path: "/products/admin/create",
            element: <ProductsForm />,
          },

          {
            path: "/products/admin/:id/edit",
            element: <ProductsForm />,
          },

          {
            path: "/products/admin/:id",
            element: <ProductDetail />,
          },

          {
            path: "/buy-products",
            element: <BuyProductsList />,
          },
          {
            path: "/buy-products/:id",
            element: <BuyProductDetail />,
          },

        ],
      },
    ],
  },
]);

export default router;
