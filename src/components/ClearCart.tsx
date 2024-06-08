'use client';

import { useCart } from '@/hooks/use-cart';
let cleared = false;
export default function ClearCart() {
  const { clearCart } = useCart();
  if (!cleared) {
    clearCart();
    cleared = true;
  }

  return <></>;
}
