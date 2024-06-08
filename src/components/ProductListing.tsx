'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { cn, formatPrice } from '@/lib/utils';
import { PRODUCT_CATEGORIES } from '@/config';
import ImageSlider from './ImageSlider';
import { HeartIcon } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import Link from 'next/link';
import { Product } from '@/payload-types';
import AddToCartButton from './AddToCartButton';

interface ProductListingProps {
  product: Product | null;
  index: number;
  isLoggedIn: boolean;
}

const ProductListing = ({
  product,
  index,
  isLoggedIn,
}: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = product?.id
    ? wishlist.some((item) => item.id === product.id)
    : false;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product || !product.id) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Find the category name based on the product's category value
  const categoryName =
    PRODUCT_CATEGORIES.find(
      ({ value }) => value === 'Categories',
    )?.featured.find(({ href }) => href.includes(product?.category || ''))
      ?.name || 'Unknown Category';

  const validUrls = product?.images
    ?.map(({ image }) => (typeof image === 'string' ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <div className="relative border border-gray-300 rounded-md p-4 flex flex-col w-full h-full">
      <button
        className="absolute top-2 right-2 z-10"
        onClick={handleWishlistToggle}
      >
        <HeartIcon
          className={isWishlisted ? 'text-red-500' : 'text-gray-300'}
        />
      </button>
      <Link href={`/product/${product?.id}`} className="group/main">
        <div
          className={cn('invisible h-full w-full cursor-pointer', {
            'visible animate-in fade-in-5': isVisible,
          })}
        >
          <ImageSlider urls={validUrls} />
          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product?.name || 'Unknown Product'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{categoryName}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(product?.price || 0)}
          </p>
          {isLoggedIn && product && <AddToCartButton product={product} />}
        </div>
      </Link>
    </div>
  );
};

const ProductPlaceholder = () => {
  return (
    <div className="border border-gray-300 rounded-md p-4 flex flex-col w-full h-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
