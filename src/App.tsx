import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';

export default function App() {
  return (
    <AuthProvider>
      <AddressProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AddressProvider>
    </AuthProvider>
  );
}
