import { useNavigate } from '@tanstack/react-router';
import { useGetCartSummary } from '../hooks/useCart';
import { ShoppingCart, Home, Package, Shield } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useAuth';

export default function Navigation() {
  const navigate = useNavigate();
  const { data: cartSummary } = useGetCartSummary();
  const { data: isAdmin } = useIsCallerAdmin();

  const cartItemCount = cartSummary?.totalItems.toString() || '0';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            HD Providers
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Home</span>
            </button>

            <button
              onClick={() => navigate({ to: '/products' })}
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Products</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => navigate({ to: '/admin' })}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Admin</span>
              </button>
            )}

            <button
              onClick={() => navigate({ to: '/cart' })}
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount !== '0' && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="hidden sm:inline font-medium">Cart</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
