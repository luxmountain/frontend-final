import React from 'react';

const AuthPage = React.lazy(() => import('./pages/auth'));
const Home = React.lazy(() => import('./pages/home'));
const UserList = React.lazy(() => import('./components/UserList'));
const UserDetail = React.lazy(() => import('./components/UserDetail'));
const UserPhotos = React.lazy(() => import('./components/UserPhotos'));

const routes = [
  {
    path: '/',
    element: Home,
    protected: true,
    label: 'Home',
  },
  {
    path: '/users',
    element: UserList,
    protected: true,
    label: 'User List',
    children: [
      {
        path: ':userId',
        element: UserDetail,
        protected: true,
        label: 'User Detail',
      },
    ],
  },
  {
    path: '/photos/:userId',
    element: UserPhotos,
    protected: true,
    label: 'User Photos',
  },
  {
    path: '/login',
    element: AuthPage,
    protected: false,
    label: 'Login',
  },
];

export default routes;
