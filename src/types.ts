import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  servings: string;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  driverId?: string;
  status: 'pending' | 'paid' | 'confirmed' | 'processing' | 'pesanan_dibuat' | 'driver_tiba_di_restoran' | 'pesanan_diambil_driver' | 'otw_menuju_lokasi' | 'on-delivery' | 'delivered' | 'pesanan_selesai' | 'cancelled';
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  estimatedTime?: string;
  completionPhoto?: string; // B64 encoded proof
  // Firebase Timestamps
  placedAt?: Timestamp;
  paidAt?: Timestamp;
  confirmedAt?: Timestamp;
  arrivedAtRestoAt?: Timestamp;
  pickedUpAt?: Timestamp;
  onTheWayAt?: Timestamp;
  deliveredAt?: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  // Legacy field for backward compatibility
  date?: string;
}
export type UserRole = 'customer' | 'driver' | 'owner';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'driver' | 'owner';
  phone?: string;
  photoURL?: string;
  address?: string;
  // Driver specific
  vehicleType?: string;
  vehiclePlate?: string;
  isActive?: boolean;
  earnings?: number;
  location?: {
    lat: number;
    lng: number;
  };
  lastActive?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  detail?: string;
  isDefault: boolean;
}

export interface DriverApplication {
  id: string;
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;

  // Documents
  ktpNumber: string;
  ktpPhoto?: string; // Storage URL
  simNumber: string;
  simPhoto?: string;

  // Vehicle Info
  vehicleType: 'motor' | 'mobil';
  vehicleBrand: string;
  vehicleYear: number;
  platNumber: string;
  stnkPhoto?: string;

  // Recruitment Status
  status: 'pending_review' | 'interview_scheduled' | 'training_scheduled' |
  'training_completed' | 'area_assigned' | 'active' | 'rejected';
  currentStage: 1 | 2 | 3 | 4 | 5 | 6;

  // Admin Notes
  adminNotes?: string;
  rejectionReason?: string;

  // Timeline
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;
  interviewDate?: Timestamp;
  trainingStartDate?: Timestamp;
  activatedAt?: Timestamp;

  // Assignment
  assignedArea?: string;
  assignedAreaCoordinates?: { lat: number; lng: number };

  // Created Driver User
  driverId?: string; // Reference to users collection
}

