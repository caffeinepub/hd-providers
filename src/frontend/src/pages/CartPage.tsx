import { useNavigate } from '@tanstack/react-router';
import { useGetCartSummary } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import { Loader2, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartSummary, isLoading } = useGetCartSummary();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const isEmpty = !cartSummary || cartSummary.items.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {isEmpty ? (
        <div className="text-center py-20">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate({ to: '/products' })}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartSummary.items.map((item) => (
              <CartItem key={item.product.id.toString()} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartSummary.totalItems.toString()})</span>
                  <span>₹{cartSummary.total.toString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{cartSummary.total.toString()}</span>
                </div>
              </div>
              <button
                onClick={() => navigate({ to: '/checkout' })}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
