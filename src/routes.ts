import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DriverDashboard } from './pages/DriverDashboard';
import { DriverEarnings } from './pages/DriverEarnings';
import { DriverProfile } from './pages/DriverProfile';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { OwnerOrders } from './pages/OwnerOrders';
import { OwnerReports } from './pages/OwnerReports';
import { OwnerSettings } from './pages/OwnerSettings';
import { OwnerProfile } from './pages/OwnerProfile';
import { RootLayout } from './components/RootLayout';
import { AddressPage } from './pages/AddressPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { PartnershipApplyPage } from './pages/PartnershipApplyPage';
import { PartnershipStatusPage } from './pages/PartnershipStatusPage';

export const router = createBrowserRouter([
  {
    path: '/partnership',
    Component: PartnershipPage,
  },
  {
    path: '/partnership/apply',
    Component: PartnershipApplyPage,
  },
  {
    path: '/partnership/status/:applicationId',
    Component: PartnershipStatusPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'product/:id',
        Component: ProductPage,
      },
      {
        path: 'cart',
        Component: CartPage,
      },
      {
        path: 'checkout',
        Component: CheckoutPage,
      },
      {
        path: 'order/:orderId',
        Component: OrderTrackingPage,
      },
      {
        path: 'orders',
        Component: OrdersPage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
      {
        path: 'address',
        Component: AddressPage,
      },
      {
        path: 'driver',
        Component: DriverDashboard,
      },
      {
        path: 'driver/earnings',
        Component: DriverEarnings,
      },
      {
        path: 'driver/profile',
        Component: DriverProfile,
      },
      {
        path: 'owner',
        Component: OwnerDashboard,
      },
      {
        path: 'owner/orders',
        Component: OwnerOrders,
      },
      {
        path: 'owner/reports',
        Component: OwnerReports,
      },
      {
        path: 'owner/settings',
        Component: OwnerSettings,
      },
      {
        path: 'owner/profile',
        Component: OwnerProfile,
      },
    ],
  },
]);
