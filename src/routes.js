import React from 'react';

const AuthPage = React.lazy(() => import('./components/LoginRegister'));
const UserList = React.lazy(() => import('./components/UserList'));
const UserDetail = React.lazy(() => import('./components/UserDetail'));
const UserPhotos = React.lazy(() => import('./components/UserPhotos'));
const UserComments = React.lazy(() => import('./components/UserComments'));
const Profile = React.lazy(() => import('./components/Profile'));
const EditProfile = React.lazy(() => import('./components/EditProfile'));

const routes = [
  {
    path: '/',
    element: UserList,
    protected: true,
    label: 'UserList',
  },
  {
    path: '/profile',
    element: Profile,
    protected: true,
    label: 'Profile',
  },
  {
    path: '/edit-profile',
    element: EditProfile,
    protected: true,
    label: 'Edit Profile',
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
    path: '/photos/:userId/:photoId?',
    element: UserPhotos,
    protected: true,
    label: 'User Photos',
  },
  {
    path: '/comments/:userId',
    element: UserComments,
    protected: true,
    label: 'User Comments',
  },
  {
    path: '/login',
    element: AuthPage,
    protected: false,
    label: 'Login',
  },
];

export default routes;
