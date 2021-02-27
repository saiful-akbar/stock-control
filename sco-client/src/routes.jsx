import React from 'react';
import { Navigate } from 'react-router-dom';

/* Layouts */
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import Logout from 'src/views/Logout';

/* views MalinLayout */
const LoginView = React.lazy(() => import('src/views/auth/LoginView'));
const NotFound = React.lazy(() => import('src/views/errors/NotFound'));
const Forbidden = React.lazy(() => import('src/views/errors/Forbidden'));

/* views DashboardLayout */
const Dashboard = React.lazy(() => import('src/views/Dashboard'));
const AccountView = React.lazy(() => import('src/views/account/AccountView'));
const Menus = React.lazy(() => import('src/views/Menus'));
const User = React.lazy(() => import('src/views/User'));
const UserCreate = React.lazy(() => import('src/views/User/UserCreate'));
const UserEdit = React.lazy(() => import('src/views/User/UserEdit'));
const UserEditMenuAccess = React.lazy(() =>
  import('src/views/User/UserEditMenuAccess')
);
const UserDetail = React.lazy(() => import('src/views/User/UserDetail'));
const Items = React.lazy(() => import('src/views/Items'));
const Consignee = React.lazy(() => import('src/views/Consignee'));
const Document = React.lazy(() => import('src/views/Document'));
const Purchase = React.lazy(() => import('src/views/Purchase'));
const Return = React.lazy(() => import('src/views/Return'));
const TakeIn = React.lazy(() => import('src/views/TakeIn'));
const Store = React.lazy(() => import('src/views/Store'));
const DeliveryNote = React.lazy(() => import('src/views/DeliveryNote'));
const TakeOut = React.lazy(() => import('src/views/TakeOut'));

/* routes */
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
        path: '/menus',
        element: <Menus />
      },
      {
        path: '/users',
        element: <User />
      },
      {
        path: '/users/create',
        element: <UserCreate />
      },
      {
        path: '/users/:id/edit',
        element: <UserEdit />
      },
      {
        path: '/users/:id/menus',
        element: <UserEditMenuAccess />
      },
      {
        path: '/users/:id',
        element: <UserDetail />
      },
      {
        path: '/items',
        element: <Items />
      },
      {
        path: '/consignee',
        element: <Consignee />
      },
      {
        path: '/store',
        element: <Store />
      },
      {
        path: '/purchase',
        element: <Purchase />
      },
      {
        path: '/return',
        element: <Return />
      },
      {
        path: '/takein',
        element: <TakeIn />
      },
      {
        path: '/delivery-note',
        element: <DeliveryNote />
      },
      {
        path: '/takeout',
        element: <TakeOut />
      },
      {
        path: '/store',
        element: <Store />
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
        element: <LoginView />
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
