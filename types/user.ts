export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'customer' | 'admin' | 'staff' | 'moderator' | 'anonymous'; // Added 'anonymous' and 'moderator' based on common roles
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    fullName: string;
    id: string;
    picture?: string; // Optional profile picture URL
    lastLoginAt?: string; // Optional last login timestamp
    googleId?: string; // Example of an optional additional field
  }