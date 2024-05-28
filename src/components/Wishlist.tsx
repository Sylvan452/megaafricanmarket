'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
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
import { useWishlist } from '@/contexts/WishlistContext';
import WishlistItem from './WishlistItem';
import { ScrollArea } from './ui/scroll-area';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const itemCount = wishlist.length;

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    recalculateTotal();
  }, [wishlist]);

  const recalculateTotal = () => {
    const total = wishlist.reduce((sum, product) => sum + product.price, 0);
    setTotalPrice(total);
  };

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <Heart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Wishlist ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea className="h-96">
                {wishlist.map((product) => (
                  <WishlistItem
                    product={product}
                    key={product.id}
                    onRemove={() => removeFromWishlist(product.id)}
                    onClose={closeSheet} // Pass the closeSheet function to WishlistItem
                  />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Total Price</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
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
                alt="empty wishlist hippo"
              />
            </div>
            <div className="text-xl font-semibold">Your wishlist is empty</div>
            <SheetTrigger asChild>
              <Link href="/product" className="text-sm text-muted-foreground">
                Start adding items to your wishlist{' '}
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Wishlist;
