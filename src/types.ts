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
  status: 'pending' | 'processing' | 'on-delivery' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  estimatedTime?: string;
  // Firebase Timestamps
  placedAt?: Timestamp;
  confirmedAt?: Timestamp;
  pickedUpAt?: Timestamp;
  deliveredAt?: Timestamp;
  cancelledAt?: Timestamp;
  // Legacy field for backward compatibility
  date?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'driver' | 'owner';
  phone?: string;
  photoURL?: string;
  // Driver specific
  vehicleType?: string;
  vehiclePlate?: string;
  isActive?: boolean;
  earnings?: number;
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

