'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductListing from './ProductListing';
import { Product } from '../payload-types';

const fetchProducts = async (query: string): Promise<Product[]> => {
  const response = await fetch(`/api/products?query=${query}`);
  const products: Product[] = await response.json();
  return products;
};

const ProductList = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const filteredProducts = await fetchProducts(query);
      setProducts(filteredProducts);
      setLoading(false);
    };

    loadProducts();
  }, [query]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <ProductListing key={index} product={null} index={index} />
        ))
      ) : products.length > 0 ? (
        products.map((product, index) => (
          <ProductListing key={product.id} product={product} index={index} />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
