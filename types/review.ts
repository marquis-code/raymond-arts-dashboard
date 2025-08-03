export interface Product {
    _id: string;
    name: string;
    discountPercentage?: number; // Optional, based on your schema
    id: string; // Mongoose virtual 'id'
  }
  
  export enum ProductReviewStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
  }
  
  export enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin",
    STAFF = "staff",
    ANONYMOUS = "anonymous",
  }
  
  export interface Review {
    _id: string;
    productId: Product; // Assuming this is populated on the frontend
    userId?: string;
    userName?: string;
    email: string;
    userRole: UserRole;
    rating: number;
    comment?: string;
    title?: string;
    imageUrls: string[];
    status: ProductReviewStatus;
    approvedBy?: string;
    approvedAt?: string; // Date string
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    id: string; // Mongoose virtual 'id'
  }
  
  // Payload for creating/updating reviews
  export interface ReviewFormPayload {
    _id?: string; // Present for update operations
    productId: string; // Product ID string for input
    userId?: string;
    userName?: string;
    email: string;
    userRole: UserRole;
    rating: number;
    comment?: string;
    title?: string;
    imageUrls?: string[]; // Array of strings
  }