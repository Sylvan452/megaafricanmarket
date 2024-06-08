'use client';

import { TQueryValidator } from '@/lib/validators/query-validator';
import ProductReel from '@/components/ProductReel';

const ProductPage = () => {
  // Define the query for fetching products
  const query: TQueryValidator = {
    limit: 16, // You can adjust the limit as needed
    // Add other query parameters if necessary
  };

  return (
    <div className="pr-7 pl-7">
      <ProductReel
        title="Featured Products"
        subtitle="Browse our latest collection"
        query={query}
        // href="/shop" // Link to the full collection page if available
      />
    </div>
  );
};

export default ProductPage;
