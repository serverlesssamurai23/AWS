'use client'; // This directive makes it a Client Component

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // To get the [slug] from the URL
import ProductCard from '@/components/products/ProductCard';
import { getProductsByCategorySlug, PaginatedProducts, Category, Product } from '@/services/api';

const CategoryProductsPage = () => {
  const params = useParams();
  const slug = params.slug as string; // slug can be string or string[]

  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [productData, setProductData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 12; // Number of products per page

  useEffect(() => {
    if (slug) {
      const fetchCategoryProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getProductsByCategorySlug(slug, { page, limit });
          setCategoryInfo(data.category);
          setProductData({ data: data.data, pagination: data.pagination });
        } catch (err: any) {
          setError(err.message || `Failed to fetch products for category ${slug}.`);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCategoryProducts();
    }
  }, [slug, page]);

  if (loading && !productData) return <p className="text-center py-10">Loading products for category...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!categoryInfo) return <p className="text-center py-10">Category not found.</p>;
  if (!productData || productData.data.length === 0) return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-center">
        {categoryInfo.name}
      </h1>
      {categoryInfo.description && <p className="text-center text-gray-600 mb-8">{categoryInfo.description}</p>}
      <p className="text-center py-10">No products found in this category.</p>
    </div>
  );

  const totalPages = productData.pagination.totalPages;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-center">
        {categoryInfo.name}
      </h1>
      {categoryInfo.description && <p className="text-center text-gray-600 mb-8">{categoryInfo.description}</p>}
      
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

export default CategoryProductsPage;
