'use client';

import { Button } from '@/components/ui/button';
import { PRODUCT_CATEGORIES } from '@/config';
import { useCart } from '@/hooks/use-cart';
import {
  calcDistanceFrom,
  calculateShippingCost,
  cn,
  formatPrice,
  getDeliverFeeForLocation,
  searchLocation,
} from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Check, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import IncrementQuantity from '@/components/IncrementQuantity';
import CartItem from '@/components/CartItem'; // Make sure to import CartItem

const Page = () => {
  const { items, removeItem, updateItemQuantity } = useCart();
  const router = useRouter();

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url);
      },
    });

  // const purchases = items.map(({ product, quantity }) => ({
  //   productId: product.id,
  //   quantity,
  // }));

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [deliveryfee, setDeliveryFee] = useState(0);
  const [needsDelivery, setNeedsDelivery] = useState(false);
  const [shippingDeets, setShippingDeets] = useState();

  useEffect(() => {
    // localStorage.removeItem('delivery-details');
    localStorage.removeItem('deliveryFee');
    (async () => {
      const { method, ...shippingDetails } = JSON.parse(
        localStorage.getItem('delivery-details') || '{}',
      );
      console.log('method:', method, 'deets', shippingDetails);
      if (method === 'ship') {
        setShippingDeets(shippingDetails);
        setNeedsDelivery(true);
        console.log('current shipping deet', shippingDetails);

        const deliveryFee = await getDeliverFeeForLocation(
          shippingDetails?.address,
          shippingDetails?.city,
          // shippingDetails.country,
          'NG',
        );

        setDeliveryFee(deliveryFee!);
        if (deliveryFee)
          localStorage.setItem('deliveryFee', formatPrice(deliveryfee));
        // setShippingDetails((old) => {
        //   const update = { ...old, address: loc?.address };
        //   localStorage.setItem('delivery-details', JSON.stringify(update));
        //   return update;
        // });
      }
      setIsMounted(true);
    })();
    // setDeliveryMethod(method || 'pickup');
    // setShippingDetails(shippingDetails);
  }, []);

  const recalculateTotal = useCallback(() => {
    const total = items.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    );
    setCartTotal(total);
  }, [items]);

  useEffect(() => {
    // setIsMounted(true);
    recalculateTotal();
  }, [items, recalculateTotal]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateItemQuantity(productId, quantity);
    recalculateTotal();
  };

  const transationfeeString = process.env.TRANSATION_FEE || '1';
  const fee = parseFloat(transationfeeString);
  // const deliveryfeeString = process.env.SHIPPING_PRICE_ID || '0';
  // const deliveryfee = parseFloat(deliveryfeeString);

  const calculateTotalAmount = (): number => {
    return cartTotal + fee + deliveryfee;
  };

  const handleCheckout = () => {
    console.log('handling');
    const totalAmount = calculateTotalAmount();
    console.log('items', items);
    createCheckoutSession({
      items: items.map((item) => {
        // (item as any).product = item.product.id;
        return {
          ...item,
          product: item.product.id,
        } as any as { product: string; quantity: number };
      }),
      totalAmount,
      needsShipping: needsDelivery,
      shippingDeets,
    });
    console.log('sent');
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/hippo-empty-cart.png"
                    fill
                    loading="eager"
                    alt="empty shopping cart hippo"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200':
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ product, quantity }) => {
                  const categoryName = PRODUCT_CATEGORIES.find(
                    ({ value }) => value === 'Categories',
                  )?.featured.find(({ href }) =>
                    href.includes(product.category),
                  )?.name;

                  // const { image } = product?.images?.[0];

                  return (
                    <CartItem
                      key={product.id}
                      product={product}
                      initialQuantity={quantity}
                      onQuantityChange={handleQuantityChange}
                    />
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Delivery Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(deliveryfee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order Total
                </div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal + fee + deliveryfee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={items.length === 0 || isLoading || !isMounted}
                onClick={handleCheckout} // Use handleCheckout here
                className="w-full"
                size="lg"
              >
                {isLoading || !isMounted ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : null}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
