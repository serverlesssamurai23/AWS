'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockArticleCategories, mockArticles, ArticleCategory, Article } from '../mockData'; // Adjust path

const ArticleCategoryPage = () => {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const currentCategory = mockArticleCategories.find(cat => cat.slug === categorySlug);
  const articlesInCategory = mockArticles.filter(article => article.category.slug === categorySlug);

  if (!currentCategory) {
    return <p className="text-center py-10">Category not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="my-8">
        <Link href="/education" className="text-sm text-blue-500 hover:underline mb-2 block">&larr; Back to Education Hub</Link>
        <h1 className="text-3xl font-bold text-blue-700 mb-1">{currentCategory.name}</h1>
        {currentCategory.description && <p className="text-md text-gray-600">{currentCategory.description}</p>}
      </header>

      {articlesInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesInCategory.map(article => (
            <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Link href={`/education/${article.slug}`}>
                <div className="relative h-48 w-full">
                  <Image src={article.imageUrl || '/images/placeholder.png'} alt={article.title} fill style={{ objectFit: 'cover' }}/>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2 hover:underline">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                  <span className="text-xs text-gray-500">{new Date(article.publishedDate).toLocaleDateString()}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-center py-10 text-gray-600">No articles found in this category yet.</p>
      )}
    </div>
  );
};

export default ArticleCategoryPage;
