'use client';

import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function ShippingPrice() {
  const [shippingPrice, setShippingPrice] = useState('');

  useEffect(() => {
    setShippingPrice(localStorage.getItem('deliveryFee')!);
    console.log('stored delivery fee', localStorage.getItem('deliveryFee')!);
  }, []);
  return (
    shippingPrice && (
      <div className="flex justify-between">
        <p>Shipping Fee</p>
        <p className="text-gray-900">{formatPrice(shippingPrice)}</p>
      </div>
    )
  );
}
