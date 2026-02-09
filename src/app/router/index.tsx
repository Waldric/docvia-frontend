import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SignInPage } from '../../features/auth/pages/SignInPage';
import { SignUpPage } from '../../features/auth/pages/SignUpPage';

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
  // Add more routes here as you build more pages
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};