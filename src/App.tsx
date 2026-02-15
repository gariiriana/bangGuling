import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';

import { NotificationProvider } from './context/NotificationContext';

import { AutoDataSync } from './components/AutoDataSync';

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AutoDataSync />
        <AddressProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
