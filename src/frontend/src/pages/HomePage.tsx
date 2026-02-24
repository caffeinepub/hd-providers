import { useNavigate } from '@tanstack/react-router';
import CategoryCard from '../components/CategoryCard';
import { ShoppingBasket, Milk, Package, UtensilsCrossed } from 'lucide-react';

const categories = [
  {
    name: 'Vegetables',
    icon: ShoppingBasket,
    image: '/assets/generated/vegetables-sample.dim_300x300.png',
    color: 'bg-green-50',
  },
  {
    name: 'Dairy',
    icon: Milk,
    image: '/assets/generated/dairy-sample.dim_300x300.png',
    color: 'bg-blue-50',
  },
  {
    name: 'Groceries',
    icon: Package,
    image: '/assets/generated/groceries-sample.dim_300x300.png',
    color: 'bg-amber-50',
  },
  {
    name: 'Food',
    icon: UtensilsCrossed,
    image: '/assets/generated/food-sample.dim_300x300.png',
    color: 'bg-orange-50',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate({ to: '/products', search: { category } });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">HD Providers</h1>
        <p className="text-xl text-gray-600">Fresh groceries and food delivered to your doorstep</p>
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              icon={category.icon}
              image={category.image}
              color={category.color}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => navigate({ to: '/products' })}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Browse All Products
        </button>
      </div>
    </div>
  );
}
