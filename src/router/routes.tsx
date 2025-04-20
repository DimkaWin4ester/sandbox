import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/Home/Home';
import NotFoundPage from '../pages/NotFound/NotFound';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
  {
    basename: '/sandbox',
  }
);
