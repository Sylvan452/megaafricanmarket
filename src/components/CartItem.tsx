import React from 'react';
import { useCart } from '@/hooks/use-cart';
import { PRODUCT_CATEGORIES } from '@/config';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/payload-types';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import IncrementQuantity from './IncrementQuantity';

interface CartItemProps {
  product: Product;
  initialQuantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  initialQuantity,
  onQuantityChange,
}) => {
  const { removeItem } = useCart();
  // console.log('\n\nproduct', product);
  if (!product) return;
  const { image } = (product?.images?.length && product?.images?.[0]) || {};

  const categoryName = PRODUCT_CATEGORIES.find(
    ({ value }) => value === 'Categories',
  )?.featured.find(({ href }) => href.includes(product.category))?.name;

  const handleQuantityChange = (quantity: number) => {
    onQuantityChange(product.id, quantity);
  };

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {typeof image !== 'string' && image?.url ? (
              <Image
                src={image.url}
                alt={product.name}
                width={40}
                height={40}
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {categoryName}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product.id)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <IncrementQuantity
            productId={product.id}
            initialQuantity={initialQuantity}
            onQuantityChange={handleQuantityChange} // Pass the handleQuantityChange function
          />
        </div>
        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price * initialQuantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
