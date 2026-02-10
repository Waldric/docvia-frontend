import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SignInPage } from '../../features/auth/pages/SignInPage';
import { SignUpPage } from '../../features/auth/pages/SignUpPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { CreateNewPasswordPage } from '../../features/auth/pages/CreateNewPasswordPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignInPage />,
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/create-new-password',
    element: <CreateNewPasswordPage />,
  },
  // Add more routes here 
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
