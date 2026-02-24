import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useOrders';
import { Loader2, CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg mb-6">Order not found</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your order</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-gray-900">#{order.id.toString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-green-600">{order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-semibold text-gray-900">₹{order.total.toString()}</p>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-2">
            {order.products.map((item) => (
              <div key={item.product.id.toString()} className="flex justify-between text-gray-700">
                <span>
                  {item.product.name} x {item.quantity.toString()}
                </span>
                <span>₹{(item.product.price * item.quantity).toString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate({ to: '/products' })}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
