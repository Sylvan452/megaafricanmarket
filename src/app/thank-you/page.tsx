import { getServerSideUser } from '@/lib/payload.utils';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { getPayloadClient } from '@/get-payload';
import { notFound, redirect } from 'next/navigation';
import { Product, User } from '@/payload-types';
import { PRODUCT_CATEGORIES } from '@/config';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import PaymentStatus from '@/components/PaymentStatus';
import { useEffect } from 'react';

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;
  const nextCookies = cookies();

  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayloadClient();

  console.log('\n\nlogged', orderId, user?.id);

  const { docs: orders } = await payload.find({
    collection: 'orders',
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;

  // useEffect(() => {}, []);

  if (!order) return notFound();

  const orderUserId =
    typeof order.orderedBy === 'string' ? order.orderedBy : order.orderedBy?.id; // Add optional chaining
  console.log('\n\nlogged', order, orderId, orderUserId, user?.id);
  if (!orderUserId || orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you&orderId=${order.id}`);
  }

  const products = order.items.map(({ product }) => product) as Product[];

  const orderTotal = products.reduce((total, product) => {
    return total + product.price;
  }, 0);

  return (
    <main className="mt-12 relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/thank_you.png"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
        <div className="lg:col-start-2">
          <p className="text-sm font-medium text-green-600">Order successful</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Thanks for ordering
          </h1>
          {order._isPaid ? (
            <p className="mt-2 text-base text-muted-foreground">
              Your order was successful. We&apos;ll ship if that was your
              selected option or you can pick up{' '}
              {order.orderedBy && typeof order.orderedBy !== 'string' ? (
                <span className="font-medium text-gray-900">
                  {order.orderedBy.email}
                </span>
              ) : null}
              .
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order, and we&apos;re currently processing it.
              So hang tight and we&apos;ll send you confirmation very soon!
            </p>
          )}
          <div className="mt-16 text-sm font-medium">
            <div className="text-muted-foreground">Order no:</div>
            <div className="mt-2 text-gray-900">{order.id}</div>

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {products.map((product) => {
                const label = PRODUCT_CATEGORIES.find(
                  ({ value }) => value === product.name,
                )?.label;

                const { image } = product.images[0];

                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative h-24 w-24">
                      {typeof image !== 'string' && image.url ? (
                        <Image
                          fill
                          src={image.url}
                          alt={`${product.name} image`}
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                        />
                      ) : null}
                    </div>

                    <div className="flex-auto flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-900">{product.name}</h3>

                        <p className="my-1">Category: {label}</p>
                      </div>

                      {order._isPaid ? (
                        <div className="text-green-600 hover:underline underline-offset-2">
                          order successful
                        </div>
                      ) : null}
                    </div>

                    <p className="flex-none font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text-gray-900">{formatPrice(orderTotal)}</p>
              </div>

              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="text-gray-900">{formatPrice(1)}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <p className="text-base">Total</p>
                <p className="text-base">{formatPrice(orderTotal + 1)}</p>
              </div>
            </div>

            <PaymentStatus
              isPaid={!!order._isPaid}
              orderEmail={
                order.orderedBy ? (order.orderedBy as User).email : ''
              }
              orderId={order.id}
            />

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link
                href="/products"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Continue shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
