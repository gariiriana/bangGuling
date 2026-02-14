import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';

import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AddressProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
