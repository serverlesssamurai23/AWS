'use client'; // This directive makes it a Client Component

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, Category } from '@/services/api'; // Assuming api.ts is in src/services

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesList = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesList();
  }, []);

  if (loading) return <p className="text-center py-10">Loading categories...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (categories.length === 0) return <p className="text-center py-10">No categories found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`} className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">{category.name}</h2>
            {category.description && <p className="text-gray-700 text-sm">{category.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
