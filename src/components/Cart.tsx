'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from './ui/separator';
import {
  SheetTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from './ui/sheet';
import { formatPrice } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useCart } from '@/hooks/use-cart';
import CartItem from './CartItem';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { items } = useCart();
  const itemCount = items.length;

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0,
  );

  const fee = 1;

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem product={product} key={product.id} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transation Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: 'w-full',
                    })}
                  >
                    {' '}
                    Continue to checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="empty shopping cart hippo"
              />
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: 'link',
                  size: 'sm',
                  className: 'text-sm text-muted-foreground',
                })}
              >
                Begin Checkout: Add Items to Your Cart{' '}
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
