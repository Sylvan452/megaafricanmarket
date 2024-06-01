import { User } from './payload-types';

export interface Product {
    id: string;
    name: string;
    category: string;
    // Add other fields as needed
  }
  
  export interface SignInResponse {
    user: {
      user: User;
      token?: string;
      exp?: number;
    };
    success: boolean;
  }
  