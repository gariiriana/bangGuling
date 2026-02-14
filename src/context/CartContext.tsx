import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Order } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerId: 'demo-customer-1',
      date: '2026-02-12',
      status: 'delivered',
      items: [
        {
          id: '1',
          name: 'Kambing Guling Utuh',
          description: 'Kambing guling utuh dengan bumbu rempah tradisional',
          price: 3500000,
          image: 'https://images.unsplash.com/photo-1636301175218-6994458a4b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwZ29hdCUyMGluZG9uZXNpYW4lMjBmb29kfGVufDF8fHx8MTc3MDg5NDM2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
          category: 'Paket Utuh',
          rating: 4.8,
          reviews: 156,
          servings: '20-25 porsi',
          quantity: 1
        }
      ],
      total: 3500000,
      deliveryAddress: 'Jl. Sudirman No. 123, Jakarta Selatan',
      paymentMethod: 'GoPay',
      estimatedTime: '45-60 menit'
    },
    {
      id: 'ORD-002',
      customerId: 'demo-customer-1',
      date: '2026-02-12',
      status: 'processing',
      items: [
        {
          id: '2',
          name: 'Paket Lengkap',
          description: 'Paket lengkap untuk 10-12 porsi',
          price: 2500000,
          image: 'https://images.unsplash.com/photo-1636301175218-6994458a4b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwZ29hdCUyMGluZG9uZXNpYW4lMjBmb29kfGVufDF8fHx8MTc3MDg5NDM2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
          category: 'Paket Lengkap',
          rating: 4.7,
          reviews: 98,
          servings: '10-12 porsi',
          quantity: 1
        }
      ],
      total: 2500000,
      deliveryAddress: 'Jl. Gatot Subroto No. 45, Jakarta Pusat',
      paymentMethod: 'OVO',
      estimatedTime: '40-55 menit'
    },
    {
      id: 'ORD-003',
      customerId: 'demo-customer-2',
      date: '2026-02-12',
      status: 'processing',
      items: [
        {
          id: '3',
          name: 'Paket Komplit',
          description: 'Paket komplit untuk 15 porsi',
          price: 3200000,
          image: 'https://images.unsplash.com/photo-1636301175218-6994458a4b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwZ29hdCUyMGluZG9uZXNpYW4lMjBmb29kfGVufDF8fHx8MTc3MDg5NDM2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
          category: 'Paket Komplit',
          rating: 4.9,
          reviews: 142,
          servings: '15 porsi',
          quantity: 1
        }
      ],
      total: 3200000,
      deliveryAddress: 'Jl. Thamrin No. 88, Jakarta Pusat',
      paymentMethod: 'DANA',
      estimatedTime: '50-65 menit'
    },
    {
      id: 'ORD-004',
      customerId: 'demo-customer-3',
      driverId: 'demo-driver-1',
      date: '2026-02-12',
      status: 'on-delivery',
      items: [
        {
          id: '4',
          name: 'Paket Hemat',
          description: 'Paket hemat untuk 8 porsi',
          price: 1800000,
          image: 'https://images.unsplash.com/photo-1636301175218-6994458a4b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwZ29hdCUyMGluZG9uZXNpYW4lMjBmb29kfGVufDF8fHx8MTc3MDg5NDM2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
          category: 'Paket Hemat',
          rating: 4.6,
          reviews: 87,
          servings: '8 porsi',
          quantity: 1
        }
      ],
      total: 1800000,
      deliveryAddress: 'Jl. HR Rasuna Said No. 22, Jakarta Selatan',
      paymentMethod: 'GoPay',
      estimatedTime: '35-50 menit'
    }
  ]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: status as Order['status'] } : order
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        orders,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
