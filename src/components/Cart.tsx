'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  searchAutocompleteLocations,
} from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useCart } from '@/hooks/use-cart';
import CartItem from './CartItem';
import AutoCompleteInput from '@/components/AutoCompleteInput';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

let settingAddress = false;
let shipingDeets: {
  address?: string;
  street?: string;
  state?: string;
  city?: string;
} = {};

const Cart = () => {
  const { items } = useCart();
  const router = useRouter();
  const itemCount = items.length;

  const [isMounted, setIsMounted] = useState(true);
  // const [isMounted, setIsMounted] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [distance, setDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    country: 'US',
    // firstName: '',
    // lastName: '',
    name: '',

    address: '',

    street: '',
    // apartment: '',
    city: '',
    state: '',
    unit: '',
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
    // localStorage.removeItem('delivery-details');
    const { method, ...shippingDetails } = JSON.parse(
      localStorage.getItem('delivery-details') || '{}',
    );
    // setDeliveryMethod(method || 'pickup');
    if (method === 'ship') handleDistanceCalculations();
    setShippingDetails(shippingDetails);
  }, []);

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
    console.log('setting delivery method', event.target.value);
    if (event.target.value === 'ship' && totalPrice < 50) {
      toast.error('Shipping is only available for orders above $50.');
      return;
    }
    if (event.target.value === 'ship') {
      handleDistanceCalculations();
    } else {
      // localStorage.removeItem('delivery-details');
      setDeliveryFee(0);
    }
    setDeliveryMethod(event.target.value);
    localStorage.setItem(
      'delivery-details',
      JSON.stringify({ ...shippingDetails, method: event.target.value }),
    );
    console.log(
      'delivery method set',
      localStorage.getItem('delivery-details'),
    );
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
    if (name === 'street') handleSettingAddress();
  };

  const fee = 1;

  const handleDistanceCalculations = async () => {
    if (settingAddress) setTimeout(handleDistanceCalculations, 5000);
    else return;
    console.log('current shipping deet', shipingDeets);
    const loc = (
      await searchLocation(
        `${shipingDeets?.street}, ${shipingDeets?.city}, ${shipingDeets?.state}, `,
        '',
        // shippingDetails.country,
        'CA,CAN,US,USA',
      )
    )?.[0];

    console.log('got location', loc);

    // if (!loc?.isConfident) return;

    const dist = await calcDistanceFrom(loc?.location);
    console.log('got dist', dist);

    if (!dist) return console.log('unable to calc distance');

    setDistance(dist);

    const deliveryFee = calculateShippingCost(dist);
    console.log('delivery fee', deliveryFee, 'dist:', dist);
    setDeliveryFee(deliveryFee);
    setShippingDetails((old) => {
      const update = { ...old, address: loc?.address };
      setDeliveryMethod((old) => {
        localStorage.setItem(
          'delivery-details',
          JSON.stringify({ ...update, method: old }),
        );
        return old;
      });
      return update;
    });
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!shippingDetails.street || !shippingDetails.city) {
      alert('Street Address and Town/City are required.');
      return;
    }
    // Proceed with form submission
  };

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
                        id="pickup"
                        name="deliveryMethod"
                        value="pickup"
                        checked={deliveryMethod === "pickup"}
                        onChange={handleDeliveryMethodChange}
                      />
                      <label htmlFor="pickup">Pick Up</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="ship"
                        name="deliveryMethod"
                        value="ship"
                        checked={deliveryMethod === "ship"}
                        onChange={handleDeliveryMethodChange}
                      />
                      <label htmlFor="ship">
                        Ship{" "}
                        <span className="text-xs block sm:inline">
                          (Free shipping within 5 miles; additional charges may
                          apply)
                        </span>
                      </label>
                    </div>
                    {deliveryMethod === "ship" && (
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
                            <label htmlFor="state">State</label>
                            {/*<input*/}
                            {/*  type="text"*/}
                            {/*  id="state"*/}
                            {/*  name="state"*/}
                            {/*  value={shippingDetails.state}*/}
                            {/*  onChange={handleShippingDetailChange}*/}
                            {/*  className="border p-1 w-full"*/}
                            {/*/>*/}
                            <AutoCompleteInput
                              getItems={async () =>
                                await searchAutocompleteLocations(
                                  shippingDetails?.state
                                )
                              }
                              resultStringKeyName={"region"}
                              type="text"
                              id="state"
                              name="state"
                              value={shippingDetails.state}
                              onChange={handleShippingDetailChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="city">Town / City</label>
                            {/*<input*/}
                            {/*  type="text"*/}
                            {/*  id="city"*/}
                            {/*  name="city"*/}
                            {/*  value={shippingDetails.city}*/}
                            {/*  onChange={handleShippingDetailChange}*/}
                            {/*  className="border p-1 w-full"*/}
                            {/*/>*/}
                            <AutoCompleteInput
                              getItems={async () =>
                                await searchAutocompleteLocations(
                                  `${shippingDetails?.city}, ${shippingDetails?.state}`
                                )
                              }
                              resultStringKeyName={"locality"}
                              type="text"
                              id="city"
                              name="city"
                              value={shippingDetails.city}
                              onChange={handleShippingDetailChange}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="
                            address"
                            >
                              Street Address
                            </label>
                            {/*<input*/}
                            {/*  type="text"*/}
                            {/*  id="
                            address"*/}
                            {/*  name="
                            address"*/}
                            {/*  value={shippingDetails.
                            address}*/}
                            {/*  onChange={handleShippingDetailChange}*/}
                            {/*  onFocus={handleSettingAddress}*/}
                            {/*  onBlur={handleAddressSet}*/}
                            {/*  className="border p-1 w-full"*/}
                            {/*  placeholder="Street name"*/}
                            {/*/>*/}
                            <AutoCompleteInput
                              getItems={async () =>
                                await searchAutocompleteLocations(
                                  `${shippingDetails?.street}, ${shippingDetails?.city}, ${shippingDetails?.state}`
                                )
                              }
                              resultStringKeyName={"street"}
                              type="text"
                              id="street"
                              name="street"
                              value={shippingDetails.street}
                              onChange={handleShippingDetailChange}
                              placeholder="Street name"
                            />
                          </div>
                          <div>
                            {/*<label htmlFor="
                            address">Street Name</
                            label>*/}
                            <input
                              type="text"
                              id="unit"
                              name="unit"
                              value={shippingDetails.unit}
                              onChange={handleShippingDetailChange}
                              onFocus={handleSettingAddress}
                              onBlur={handleAddressSet}
                              className="border p-1 w-full"
                              placeholder="House number, Apartment, suite, unit, etc."
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="zip">Zip Code</label>
                            <input
                              type="text"
                              id="zip"
                              name="zip"
                              // value={shippingDetails.zip}
                              onFocus={handleSettingAddress}
                              onBlur={handleAddressSet}
                              onChange={handleShippingDetailChange}
                              className="border p-1 w-full"
                            />
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
                    {deliveryMethod === "ship" && (
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
                  <SheetTrigger id="close" className="h-4" asChild>
                    <div className="h-7 w-full">{""}</div>
                  </SheetTrigger>
                  <SheetFooter>
                    <Link
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        router.prefetch("/cart");
                        if (deliveryMethod === "ship" && totalPrice < 50) {
                          toast.error(
                            "Shipping is only available for orders above $50."
                          );
                          return;
                        }
                        if (deliveryMethod === "ship") {
                          let requiredShippingFields = {
                            state: "State",
                            city: "Town / City",
                            street: "Street Address",
                            unit: "House Number",
                            phone: "Phone Number",
                          };

                          for (const requiredField of Object.keys(
                            requiredShippingFields
                          )) {
                            if (!shippingDetails[requiredField]) {
                              return toast.error(
                                `You must specify ${Object.values(
                                  requiredShippingFields
                                ).join(", ")}. \nYou've not specified ${
                                  requiredShippingFields[requiredField]
                                }`
                              );
                            }
                          }
                        }
                        (document.querySelector("#close") as any)?.click();
                        console.log("about to navigate");
                        router.push("/cart");
                      }}
                      className={buttonVariants({
                        className: "w-full",
                      })}
                    >
                      Continue to checkout
                    </Link>
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
                      variant: "link",
                      size: "sm",
                      className: "text-sm text-muted-foreground",
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
