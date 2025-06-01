import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/Home/Home';
import NotFoundPage from '../pages/NotFound/NotFound';
import CurrencyRate from 'src/pages/CurrencyRate/CurrencyRate';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/currency-rate',
      element: <CurrencyRate />,
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
