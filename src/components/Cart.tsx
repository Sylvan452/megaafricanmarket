'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
import {
  formatPrice,
  calculateShippingCost,
  calcDistanceFrom,
  searchLocation,
} from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useCart } from '@/hooks/use-cart';
import CartItem from './CartItem';

let settingAddress = false;
let shipingDeets : {address?: string; city?: string} = {};

const Cart = () => {
  const { items } = useCart();
  const itemCount = items.length;

  const [isMounted, setIsMounted] = useState(true);
  // const [isMounted, setIsMounted] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('ship');
  const [distance, setDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [shippingDetails, setShippingDetails] = useState({
    country: 'US',
    // firstName: '',
    // lastName: '',
    name: '',
    address: '',
    // apartment: '',
    city: '',
    // zip: '',
    phone: '',
  });

  const recalculateTotal = useCallback(() => {
    const total = items.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    );
    setTotalPrice(total);
    setDeliveryFee(calculateShippingCost(distance));
  }, [items, distance]);

  useEffect(() => {
    setIsMounted(true);
    recalculateTotal();
  }, [items, deliveryMethod, distance, recalculateTotal]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    const item = items.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      recalculateTotal();
    }
  };

  const handleDeliveryMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDeliveryMethod(event.target.value);
  };

  const handleDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(parseFloat(event.target.value));
  };

  const handleShippingDetailChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    console.log('name', name, 'value', value);
    setShippingDetails((prevDetails) => {
      shipingDeets = { ...prevDetails, [name]: value };
      return { ...prevDetails, [name]: value };
    });
  };

  const fee = 1;

  function getDist() {}

  const handleDistanceCalculations = async () => {
    console.log('current shipping deet', shipingDeets);
    const loc = (
      await searchLocation(
        shipingDeets?.address,
        shipingDeets?.city,
        // shippingDetails.country,
        'NG',
      )
    )?.[0];

    console.log('got location', loc);

    if (!loc?.isConfident) return;

    const dist = await calcDistanceFrom(loc?.location);
    console.log('got dist', dist);

    if (!dist) return console.log('unable to calc distance');

    setDistance(dist);

    setDeliveryFee(calculateShippingCost(dist));

    if (settingAddress) setTimeout(handleDistanceCalculations, 5000);
  };

  function handleSettingAddress(): void {
    settingAddress = true;
    // calculate distance (along with getting location) every five secs
    // get location, display, calculate distance, calc price
    setTimeout(handleDistanceCalculations, 5000);
  }

  function handleAddressSet(): void {
    settingAddress = false;
    handleDistanceCalculations();
  }

  return (
    <Sheet>
      <SheetTrigger
        defaultChecked={false}
        className="group -m-2 flex items-center p-2"
      >
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <ScrollArea className="h-full">
          <div className="flex flex-col pr-6">
            <SheetHeader className="space-y-2.5">
              <SheetTitle>Cart ({itemCount})</SheetTitle>
            </SheetHeader>
            {itemCount > 0 ? (
              <>
                <div className="flex flex-col">
                  {items.map(({ product, quantity }) => (
                    <CartItem
                      product={product}
                      key={product.id}
                      initialQuantity={quantity}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
                <div className="space-y-4">
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="ship"
                        name="deliveryMethod"
                        value="ship"
                        checked={deliveryMethod === 'ship'}
                        onChange={handleDeliveryMethodChange}
                      />
                      <label htmlFor="ship">
                        Ship{' '}
                        <span className="text-xs block sm:inline">
                          (Free shipping within 5 miles; additional charges may
                          apply)
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="pickup"
                        name="deliveryMethod"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={handleDeliveryMethodChange}
                      />
                      <label htmlFor="pickup">Pick Up</label>
                    </div>
                    {deliveryMethod === 'ship' && (
                      <>
                        <div className="mt-4 space-y-2">
                          <div>
                            <label htmlFor="country">Country/Region</label>
                            <select
                              id="country"
                              name="country"
                              value={shippingDetails.country}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            >
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="firstName">
                              Receiver{"'"}s Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={shippingDetails.name}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            />
                          </div>
                          {/* <div>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={shippingDetails.lastName}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            />
                          </div> */}
                          <div>
                            <label htmlFor="address">Complete Address</label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={shippingDetails.address}
                              onChange={handleShippingDetailChange}
                              onFocus={handleSettingAddress}
                              onBlur={handleAddressSet}
                              className="border p-1 w-full"
                              required
                            />
                          </div>
                          {/* <div>
                            <label htmlFor="apartment">
                              Apartment, Suite, etc. (optional)
                            </label>
                            <input
                              type="text"
                              id="apartment"
                              name="apartment"
                              value={shippingDetails.apartment}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            />
                          </div> */}
                          <div>
                            <label htmlFor="city">City</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={shippingDetails.city}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            />
                          </div>
                          {/* <div>
                            <label htmlFor="zip">Zip Code</label>
                            <input
                              type="text"
                              id="zip"
                              name="zip"
                              value={shippingDetails.zip}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            />
                          </div> */}
                          <div>
                            <label htmlFor="phone">Contact Phone Number</label>
                            <input
                              type="text"
                              id="phone"
                              name="phone"
                              value={shippingDetails.phone}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <label htmlFor="distance">Distance (miles):</label>
                          <input
                            type="number"
                            id="distance"
                            value={distance}
                            onChange={handleDistanceChange}
                            disabled
                            className="border p-1"
                            min="0"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-1.5 text-sm">
                    {deliveryMethod === 'ship' && (
                      <div className="flex">
                        <span className="flex-1">Shipping</span>
                        <span>{formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex">
                      <span className="flex-1">Transaction Fee</span>
                      <span>{formatPrice(fee)}</span>
                    </div>
                    <div className="flex">
                      <span className="flex-1">Total</span>
                      <span>{formatPrice(totalPrice + fee + deliveryFee)}</span>
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
                    Begin Checkout: Add Items to Your Cart
                  </Link>
                </SheetTrigger>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
