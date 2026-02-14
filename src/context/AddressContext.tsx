import { createContext, useContext, useState, ReactNode } from 'react';

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  detail: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const defaultAddresses: Address[] = [
  {
    id: '1',
    label: 'Rumah',
    name: 'Budi Santoso',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 123, Kebayoran Baru',
    detail: 'Rumah cat putih, pagar hitam',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Kantor',
    name: 'Budi Santoso',
    phone: '081234567890',
    address: 'Jl. Gatot Subroto Kav. 52-53',
    detail: 'Gedung Tower A Lantai 15',
    isDefault: false,
  },
];

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    defaultAddresses.find((a) => a.isDefault) || null
  );

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses([...addresses, newAddress]);
    if (address.isDefault) {
      setAddresses(
        addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
      );
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(addresses.find((a) => a.id !== id) || null);
    }
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses(
      addresses.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    if (selectedAddress?.id === id) {
      setSelectedAddress({ ...selectedAddress, ...updates });
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        deleteAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within AddressProvider');
  }
  return context;
}
