import React from 'react';
import {
  Navigate
} from 'react-router-dom';

/*
 * Layouts 
 */
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import Logout from 'src/layouts/Logout';

/*
 * Views
 */
import Dashboard from 'src/views/Dashboard';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import AccountView from 'src/views/account/AccountView';
import Menus from './views/Menus';
import User from './views/User';
import UserCreate from './views/User/UserCreate';
import UserEdit from './views/User/UserEdit';
import UserEditMenuAccess from './views/User/UserEditMenuAccess';
import UserView from './views/User/UserView';

const routes = [{
  path: '/',
  element: < DashboardLayout />,
  children: [
    {
      path: '/dashboard',
      element: <Dashboard />
    }, {
      path: '/account',
      element: <AccountView />
    }, {
      path: '/menu',
      element: <Menus />
    }, {
      path: '/user',
      element: <User />
    }, {
      path: '/user/create',
      element: <UserCreate />
    }, {
      path: '/user/:id/edit',
      element: <UserEdit />
    }, {
      path: '/user/:id/menus',
      element: <UserEditMenuAccess />
    }, {
      path: '/user/:id',
      element: <UserView />
    }, {
      path: '/',
      element: <Navigate to="/dashboard" />
    }, {
      path: '*',
      element: <Navigate to="/404" />
    }
  ]
}, {
  path: '/login',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <LoginView />
    }, {
      path: '*',
      element: <Navigate to="/login" />
    }
  ]
}, {
  path: '/404',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <NotFoundView />
    }
  ]
}, {
  path: '/logout',
  element: <Logout />,
}
];

export default routes;
