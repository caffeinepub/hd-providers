import { ShoppingCart } from 'lucide-react';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: bigint) => void;
  isAddingToCart: boolean;
}

export default function ProductCard({ product, onAddToCart, isAddingToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <img
          src={product.image.getDirectURL()}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toString()}</span>
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={isAddingToCart}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
