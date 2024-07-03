// @ts-nocheck
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import { buttonVariants } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useSearchParams } from 'next/navigation';

config.autoAddCss = false;

library.add(faTwitter, faFacebook, faInstagram);

const perks = [
  {
    name: 'Instant Delivery',
    Icon: Truck,
    description:
      'Enjoy free delivery to your doorstep within 5-mile.<br />For distances beyond 5 miles, a fee of 50 cents per mile applies.<br /> Order online and pick up in 1 hour',
  },
  {
    name: 'Guaranteed Quality',
    Icon: CheckCircle,
    description:
      'Every product meets high standards for freshness, quality, and taste.<br />Your satisfaction is our priority.',
  },
  {
    name: 'How to Shop',
    Icon: ShoppingBag,
    description:
      'Browse through the collection on our website.<br />Walk into our store during operational hours.<br />Call or text our sales team to place an order.<br /> Massive discount for large purchases',
  },
];

export default function Home({
  // params,
  searchParams: { query = '' },
}: {
  searchParams: { query?: string };
}) {
  // const searchParams = useSearchParams();
  // console.log('searchParams', query);

  // if (!query)
  return (
    <>
      {query ? (
        <section className="border-t border-gray-200 bg-gray-50">
          {/* <MaxWidthWrapper className="py-20">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
              {perks.map((perk) => (
                <div
                  key={perk.name}
                  className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                >
                  <div className="md:flex-shrink-0 flex justify-center">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-900">
                      {<perk.Icon className="w-1/3 h-1/3" />}
                    </div>
                  </div>

                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className="text-base font-medium text-gray-900">
                      {perk.name}
                    </h3>
                    <p
                      className="mt-3 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: perk.description }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MaxWidthWrapper> */}
          <div>
            <MaxWidthWrapper>
              {/* <hr className="my-8 border-gray-300" /> */}
              <ProductReel
                query={{
                  sort: 'desc',
                  // limit: 8,
                  name: query,
                  category: query,
                  brand: query,
                }}
                isSearch={true}
                title={`Search results for "${query}"`}
              />
            </MaxWidthWrapper>
          </div>
        </section>
      ) : (
        <>
          <MaxWidthWrapper>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 py-10 mx-auto text-center flex flex-col items-center max-w-3xl md:pr-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
                  Explore Your Ultimate One-Stop Shop for High Quality, Fresh{' '}
                  <span
                    style={{ display: 'inline' }}
                    className="text-green-700"
                  >
                    African
                  </span>{' '}
                  &{' '}
                  <span style={{ display: 'inline' }} className="text-red-600">
                    Caribbean
                  </span>{' '}
                  Groceries!
                </h1>

                <p className="mt-6 text-lg max-w-prose text-muted-foreground">
                  Welcome to{' '}
                  <span className="text-red-600 text-xl">
                    Mega Int'l African/Caribbean Market:
                  </span>{' '}
                  We Ship to all US states and Canada.
                </p>
                <p>
                  For SNAP/EBT/ZELLE/CASH-APP Orders, Please call: 443 776 1887
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link href="/product" className={buttonVariants()}>
                    Shop Now
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center items-center">
                <Image
                  src="/hero.png"
                  alt="hero"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
            <hr className="my-8 border-gray-300" />
            <ProductReel
              query={{ sort: '-createdAt', limit: 8 }}
              href="/products"
              title="Our Products"
            />
          </MaxWidthWrapper>
          <section className="border-t border-gray-200 bg-gray-50">
            <MaxWidthWrapper className="py-20">
              <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
                {perks.map((perk) => (
                  <div
                    key={perk.name}
                    className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                  >
                    <div className="md:flex-shrink-0 flex justify-center">
                      <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-900">
                        {<perk.Icon className="w-1/3 h-1/3" />}
                      </div>
                    </div>

                    <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                      <h3 className="text-base font-medium text-gray-900">
                        {perk.name}
                      </h3>
                      <p
                        className="mt-3 text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: perk.description }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </MaxWidthWrapper>
            <div>
              <MaxWidthWrapper>
                <hr className="my-8 border-gray-300" />
                <ProductReel
                  query={{ sort: '-ranking', limit: 8 }}
                  href="/product"
                  title="Best Selling Products"
                />
              </MaxWidthWrapper>
            </div>
          </section>
        </>
      )}
    </>
  );
}
