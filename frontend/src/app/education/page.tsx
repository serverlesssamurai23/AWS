'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockArticleCategories, mockArticles, ArticleCategory, Article } from './mockData'; // Adjust path

const EducationHubPage = () => {
  const featuredArticles = mockArticles.filter(article => article.isFeatured).slice(0, 3); // Get up to 3 featured

  return (
    <div className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Eye Health & Education Hub</h1>
        <p className="text-lg text-gray-600">Your trusted resource for vision care and eyewear knowledge.</p>
      </header>

      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map(article => (
              <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Link href={`/education/${article.slug}`}>
                  <div className="relative h-48 w-full">
                    <Image src={article.imageUrl || '/images/placeholder.png'} alt={article.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2 hover:underline">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                    <span className="text-xs text-gray-500">In: {article.category.name} &bull; {new Date(article.publishedDate).toLocaleDateString()}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Article Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockArticleCategories.map(category => (
            <Link key={category.id} href={`/education/category/${category.slug}`} className="block p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-center transform hover:scale-105">
              <h3 className="text-xl font-semibold">{category.name}</h3>
              {category.description && <p className="text-sm opacity-90 mt-1">{category.description}</p>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EducationHubPage;
