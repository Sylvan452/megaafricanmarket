'use client';

import { formatPrice } from '@/lib/utils';

const shippingPrice = localStorage.getItem('deliveryFee');
export function ShippingPrice() {
  return (
    shippingPrice && (
      <div className="flex justify-between">
        <p>Shipping Fee</p>
        <p className="text-gray-900">{shippingPrice}</p>
      </div>
    )
  );
}
