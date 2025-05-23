'use client'; // This directive makes it a Client Component

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { getProducts, PaginatedProducts, Product } from '@/services/api'; // Assuming api.ts is in src/services

const ProductsPage = () => {
  const [productData, setProductData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 12; // Number of products per page

  useEffect(() => {
    const fetchProductList = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts({ page, limit });
        setProductData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductList();
  }, [page]);

  if (loading && !productData) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!productData || productData.data.length === 0) return <p className="text-center py-10">No products found.</p>;

  const totalPages = productData.pagination.totalPages;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productData.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages || loading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
