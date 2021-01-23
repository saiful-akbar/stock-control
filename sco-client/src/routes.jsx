import React from 'react';
import {
  Navigate
} from 'react-router-dom';

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
const UserEditMenuAccess = React.lazy(() => import('src/views/User/UserEditMenuAccess'));
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
const routes = [{
  path: '/',
  element: < DashboardLayout />,
  children: [
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/documents',
      element: <Document />,
    },
    {
      path: '/account',
      element: <AccountView />
    },
    {
      path: '/menu',
      element: <Menus />
    },
    {
      path: '/user',
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
      path: '/user/:id/menus',
      element: <UserEditMenuAccess />
    },
    {
      path: '/user/:id',
      element: <UserDetail />
    },
    {
      path: '/master/items',
      element: <Items />,
    },
    {
      path: '/master/consignee',
      element: <Consignee />,
    },
    {
      path: '/master/store',
      element: <Store />,
    },
    {
      path: '/incoming/purchase',
      element: <Purchase />,
    },
    {
      path: '/incoming/return',
      element: <Return />,
    },
    {
      path: '/incoming/takein',
      element: <TakeIn />,
    },
    {
      path: '/outgoing/delivery-note',
      element: <DeliveryNote />,
    },
    {
      path: '/outgoing/takeout',
      element: <TakeOut />,
    },
    {
      path: '/master/store',
      element: <Store />,
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
  element: <Logout />,
}];

export default routes;
