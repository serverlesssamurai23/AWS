'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockArticles, Article } from './mockData'; // Adjust path

const ArticleDetailPage = () => {
  const params = useParams();
  const articleSlug = params.articleSlug as string;

  const article = mockArticles.find(art => art.slug === articleSlug);

  if (!article) {
    return <p className="text-center py-10">Article not found.</p>;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <header className="my-8">
        <Link href="/education" className="text-sm text-blue-500 hover:underline mb-2 block">&larr; Back to Education Hub</Link>
        {article.category && (
            <Link href={`/education/category/${article.category.slug}`} className="text-xs text-blue-600 uppercase font-semibold tracking-wider hover:underline">
                {article.category.name}
            </Link>
        )}
        <h1 className="text-4xl font-bold text-gray-800 my-2">{article.title}</h1>
        <div className="text-sm text-gray-500">
          {article.author && <span>By {article.author} &bull; </span>}
          <span>Published on {new Date(article.publishedDate).toLocaleDateString()}</span>
        </div>
      </header>

      {article.imageUrl && (
        <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden shadow-lg mb-8">
          <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
        </div>
      )}
      
      {/* Using prose for Tailwind typography styling if content is HTML/Markdown */}
      <article className="prose lg:prose-xl max-w-none mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>

      <div className="mt-12 text-center">
        <Link href="/education" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
          Explore More Articles
        </Link>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
