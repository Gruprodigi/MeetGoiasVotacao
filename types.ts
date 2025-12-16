export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Nomination {
  id: string;
  dishName: string;
  restaurantName: string;
  city: string;
  description?: string;
  notes?: string;
  status: Status;
  ip: string;
  userAgent: string;
  createdAt: string; // ISO Date string
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string; // e.g., "Approved Nomination 123"
  timestamp: string;
}

export interface NominationStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  byCity: Record<string, number>;
  byDish: Record<string, number>;
  byRestaurant: Record<string, number>;
}
