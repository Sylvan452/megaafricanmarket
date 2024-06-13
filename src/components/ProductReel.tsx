'use client';

import { TQueryValidator } from '@/lib/validators/query-validator';
import { Product } from '@/payload-types';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import ProductListing from './ProductListing';
import { boolean } from 'zod';

interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
  isSearch?: boolean;
}

const FALLBACK_LIMIT = 8;

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query, isSearch } = props;
  const [currentPage, setCurrentPage] = useState();
  useEffect(() => {
    console.log("current page", currentPage)
    setCurrentPage(1)
  }, []);
  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        page: (currentPage) || 1,
        // page: ,
        // cursor: 2,
        query,
        // isSearch,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      },
    );

  const products = queryResults?.pages.flatMap((page) => page.items);
  console.log(title, 'products', products);
  // console.log('query', query);
  let map: (Product | null)[] = [];
  if (products && products.length) {
    map = products;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  const handleNextPage = () => {
    // console.log("curr p in next",currentPage)
    setCurrentPage((prevPage) => (prevPage || 1) + 1);
  };

  const handlePreviousPage = () => {
    // console.log("curr p in prev",currentPage)
    if (currentPage > 1) {
      setCurrentPage((prevPage) => (prevPage || 2) - 1);
    }
  };

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-green-600 hover:text-green-500 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {map.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                product={product}
                index={i}
                isLoggedIn={false}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={
            products && products.length < (query.limit ?? FALLBACK_LIMIT)
          }
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductReel;
