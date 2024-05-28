// pages/api/products.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../payload-types';
import { Products } from '../../../collections/Products/Products'; // Adjust the path as necessary

// Define the type for Products
const fetchProducts = async (): Promise<Product[]> => {
  // Replace this with actual database fetching logic if needed
  return Products;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, sort, query } = req.query;

  let filteredProducts = await fetchProducts();

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product: Product) => product.category === category
    );
  }

  if (query) {
    filteredProducts = filteredProducts.filter(
      (product: Product) => product.name.toLowerCase().includes((query as string).toLowerCase())
    );
  }

  if (sort === 'asc' || sort === 'desc') {
    filteredProducts = filteredProducts.sort((a: Product, b: Product) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (sort === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
  }

  res.status(200).json({ products: filteredProducts });
}
