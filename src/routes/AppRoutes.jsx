import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import AuthCallback from "../pages/auth/authCallback";
import Category from "../pages/admin/Category";
import Product from "../pages/admin/Product";
import ProtectRouteAdmin from "./ProtectRouteAdmin";
import User from "../pages/admin/User";
import Order from "../pages/admin/Order";
import Notfound from "../pages/Notfound";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Address from "../pages/Address";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import PaymentQRCode from "../pages/payment/PaymentQRCode";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "address",
        element: <Address />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },{
        path: "contact",
        element: <Contact />,
      },
      {
        path:"payment/qr-code",
        element:<PaymentQRCode />
      }
    ],
  },
  {
    path: "/admin",
    element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "user",
        element: <User />
      },
      {
        path: "order",
        element: <Order />
      }
    ],
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />
  },{
    path: "*",
    element: <Notfound />,
  }
]);
const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
