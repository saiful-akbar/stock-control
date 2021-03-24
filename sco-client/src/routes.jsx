import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Layouts
 */
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import Logout from 'src/views/auth/Logout';

/**
 * views MainLayout
 */
const Login = React.lazy(() => import('src/views/auth/Login'));
const NotFound = React.lazy(() => import('src/views/errors/NotFound'));
const Forbidden = React.lazy(() => import('src/views/errors/Forbidden'));

/**
 * views DashboardLayout
 */
const Dashboard = React.lazy(() => import('src/views/Dashboard'));
const AccountView = React.lazy(() => import('src/views/account/AccountView'));
const Menus = React.lazy(() => import('src/views/Menus'));
const Items = React.lazy(() => import('src/views/Items'));
const Document = React.lazy(() => import('src/views/Document'));
const Return = React.lazy(() => import('src/views/Return'));
const Store = React.lazy(() => import('src/views/Store'));
const DeliveryNote = React.lazy(() => import('src/views/DeliveryNote'));
const User = React.lazy(() => import('src/views/User'));
const UserCreate = React.lazy(() => import('src/views/User/UserCreate'));
const UserEdit = React.lazy(() => import('src/views/User/UserEdit'));
const UserDetail = React.lazy(() => import('src/views/User/UserDetail'));

/**
 * Routes
 */
const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/documents',
        element: <Document />
      },
      {
        path: '/account',
        element: <AccountView />
      },
      {
        path: '/menu-management',
        element: <Menus />
      },
      {
        path: '/users',
        element: <User />
      },
      {
        path: '/user/create',
        element: <UserCreate />
      },
      {
        path: '/user/:id/edit',
        element: <UserEdit />
      },
      {
        path: '/user/:id',
        element: <UserDetail />
      },
      {
        path: '/items',
        element: <Items />
      },
      {
        path: '/store',
        element: <Store />
      },
      {
        path: '/return',
        element: <Return />
      },
      {
        path: '/delivery-note',
        element: <DeliveryNote />
      },
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '*',
        element: <Navigate to="/error/notfound" />
      }
    ]
  },
  {
    path: '/login',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '*',
        element: <Navigate to="/login" />
      }
    ]
  },
  {
    path: '/error',
    element: <MainLayout />,
    children: [
      {
        path: '/notfound',
        element: <NotFound />
      },
      {
        path: '/forbidden',
        element: <Forbidden />
      }
    ]
  },
  {
    path: '/logout',
    element: <Logout />
  }
];

export default routes;
