'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/payload-types';
import { useEffect } from 'react';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Load wishlist from window?.localStorage on component mount
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof localStorage === 'undefined') return [];

    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  // Save wishlist to window?.localStorage whenever it changes
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => [...prev, product]);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((product) => product.id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
