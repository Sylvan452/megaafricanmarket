import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../payload-types';
import clientPromise from '../../../lib/mongodb'; // Adjust the path as necessary

const fetchProducts = async (): Promise<Product[]> => {
  const client = await clientPromise;
  const db = client.db(); // Add the database name if necessary
  const products = await db.collection('products').find().toArray();

  return products.map(product => ({
    id: product._id.toString(), // Convert MongoDB ObjectId to string
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl,
    images: product.images || [], // Provide default value if not present
    createdAt: product.createdAt || new Date().toISOString(), // Default to current date if not present
    updatedAt: product.updatedAt || new Date().toISOString(), // Default to current date if not present
  })) as Product[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, sort, query, page = 1, limit = 8 } = req.query;

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

  const startIndex = (Number(page) - 1) * Number(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + Number(limit));

  res.status(200).json({ products: paginatedProducts });
}
