import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../payload-types';
import clientPromise from '../../../lib/mongodb'; // Adjust the path as necessary
import { NextRequest, NextResponse } from 'next/server';

const fetchProducts = async (): Promise<Product[]> => {
  const client = await clientPromise;
  const db = client.db(); // Add the database name if necessary
  const products = await db.collection('products').find().toArray();

  return products.map((product) => ({
    id: product._id.toString(), // Convert MongoDB ObjectId to string
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl,
    ranking: product.ranking,
    images: product.images || [], // Provide default value if not present
    createdAt: product.createdAt || new Date().toISOString(), // Default to current date if not present
    updatedAt: product.updatedAt || new Date().toISOString(), // Default to current date if not present
  })) as Product[];
};

export async function GET(req: NextRequest, res: NextResponse) {
  const {
    category,
    sort,
    query,
    page = 1,
    limit = 8,
  } = (() => {
    const params = new URL(req.url).searchParams;
    const result: Record<any, any> = {};
    const entry = params.entries().next();
    while (entry) {
      const [key, value] = entry.value();
      result[key] = value;
    }
    return result;
  })();
  // const { category, sort, query, page = 1, limit = 8 } = req.params;

  let filteredProducts = await fetchProducts();

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product: Product) => product.category === category,
    );
  }

  if (query) {
    filteredProducts = filteredProducts.filter((product: Product) =>
      product.name.toLowerCase().includes((query as string).toLowerCase()),
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
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + Number(limit),
  );

  // res.json
  // res.body = ({ products: paginatedProducts });
  // res.status(200).json({ products: paginatedProducts });
  return { body: { products: paginatedProducts } } as unknown as NextResponse;
}
