import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from './BottomNav';
import { DriverBottomNav } from './DriverBottomNav';

export function RootLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect based on role if authenticated
    if (isAuthenticated && location.pathname === '/') {
      if (user?.role === 'driver') {
        navigate('/driver');
      } else if (user?.role === 'owner') {
        navigate('/owner');
      }
      // Customer stays on home page
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  // Determine which bottom nav to show based on role and current page
  const showBottomNav = () => {
    // Hide bottom nav on product detail pages and address forms to allow actions to be visible
    if (
      location.pathname.startsWith('/product/') ||
      location.pathname.startsWith('/address/') ||
      location.pathname.startsWith('/checkout') ||
      location.pathname.startsWith('/order/')
    ) {
      return null;
    }
    // Don't show bottom nav for owner role (desktop layout with sidebar)
    if (user?.role === 'owner') {
      return null;
    } else if (user?.role === 'driver') {
      return <DriverBottomNav />;
    }
    // Show customer bottom nav for guest and customer
    return <BottomNav />;
  };
  return (
    <>
      <Outlet />
      {showBottomNav()}
    </>
  );
}
