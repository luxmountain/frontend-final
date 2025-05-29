import React from 'react';

const AuthPage = React.lazy(() => import('./pages/auth'));
const Home = React.lazy(() => import('./pages/home'));
const routes = [
  {
    path: '/',
    element: Home,
    protected: true,
    label: 'Home',
    children: [],
  },
  {
    path: '/login',
    element: AuthPage,
    protected: false,
    label: 'Auth Page',
    children: [],
  },
];

export default routes;
