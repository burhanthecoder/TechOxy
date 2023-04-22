import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Product from './pages/Product';
import Profile from './pages/Profile';
import NotFound from './pages/Page404';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import YourOrders from './pages/YourOrders';

// ----------------------------------------------------------------------

export default function Router() {
  const user = useSelector((state) => state.userInfo);
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        // { element: <Navigate to="/dashboard/app" replace /> },
        { path: '', element: <Home /> },
        { path: 'orders', element: <Orders /> },
        { path: 'products', element: <Products /> },
        { path: 'product/:id', element: <Product /> },
        { path: 'profile', element: user.token ? <Profile /> : <Navigate to="/auth/login" /> },
        { path: 'checkout', element: user.token ? <Checkout /> : <Navigate to="/auth/login" /> },
        { path: 'orders', element: user.token ? <Orders /> : <Navigate to="/auth/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/auth',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <Register /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" /> }
  ]);
}
