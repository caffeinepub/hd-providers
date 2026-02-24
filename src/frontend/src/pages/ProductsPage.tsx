import { useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import ProductCard from '../components/ProductCard';
import { useGetAllProducts, useGetProductsByCategory } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['All', 'Vegetables', 'Dairy', 'Groceries', 'Food'];

export default function ProductsPage() {
  const search = useSearch({ strict: false }) as { category?: string };
  const initialCategory = search.category || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const { data: allProducts, isLoading: loadingAll } = useGetAllProducts();
  const { data: categoryProducts, isLoading: loadingCategory } = useGetProductsByCategory(
    selectedCategory !== 'All' ? selectedCategory : ''
  );

  const addToCartMutation = useAddToCart();

  const products = selectedCategory === 'All' ? allProducts : categoryProducts;
  const isLoading = selectedCategory === 'All' ? loadingAll : loadingCategory;

  const handleAddToCart = async (productId: bigint) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Products</h1>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id.toString()}
              product={product}
              onAddToCart={handleAddToCart}
              isAddingToCart={addToCartMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
