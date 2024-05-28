'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '../contexts/WishlistContext';
import { HeartIcon } from 'lucide-react';

const WishlistInfo = () => {
  const { wishlist } = useWishlist();

  return (
    <Link href="/wishlist" className="ml-4">
      <HeartIcon className="h-6 w-6 text-gray-700" />
      <span className="sr-only">Wishlist</span>
      <span className="ml-2">{wishlist.length}</span>
    </Link>
  );
};

export default WishlistInfo;
