import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/payload-types';

interface WishlistItemProps {
  product: Product;
  onRemove: () => void;
  onClose: () => void; // Add the onClose prop
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  product,
  onRemove,
  onClose,
}) => {
  const { image } = product.images[0];

  return (
    <div className="flex items-center space-x-4 pb-4">
      <Link href={`/product/${product.id}`} onClick={onClose}>
        <span>
          <Image
            src={image.url}
            alt={product.name}
            width={100} // Ensure width is provided
            height={100} // Ensure height is provided
            className="object-cover"
          />
        </span>
      </Link>
      <div className="flex-1">
        <Link
          href={`/product/${product.id}`}
          className="text-gray-800 font-semibold hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-gray-500">{product.category}</p>
        <p className="text-gray-700">{product.description}</p>
      </div>
      <button
        className="text-red-500 hover:text-red-700 focus:outline-none"
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
};

export default WishlistItem;
