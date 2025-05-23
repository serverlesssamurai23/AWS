import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Using next/image for optimization
import { Product } from '@/services/api'; // Assuming api.ts is in src/services

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const placeholderImage = "/images/placeholder.png"; // Add a placeholder image to public/images

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`} className="block">
        <div className="w-full h-48 relative mb-2 rounded overflow-hidden">
          <Image 
            src={product.main_image_url || placeholderImage} 
            alt={product.name} 
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
          />
        </div>
        <h3 className="text-lg font-semibold truncate" title={product.name}>{product.name}</h3>
      </Link>
      {product.category_name && (
        <Link href={`/categories/${product.category_slug}`} className="text-sm text-gray-500 hover:underline">
          {product.category_name}
        </Link>
      )}
      <p className="text-lg font-bold text-blue-600 mt-1">${product.price.toFixed(2)}</p>
      <p className="text-xs text-gray-400">SKU: {product.sku}</p>
      {product.stock_quantity !== undefined && (
         <p className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
           {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
         </p>
      )}
      <Link href={`/products/${product.id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
