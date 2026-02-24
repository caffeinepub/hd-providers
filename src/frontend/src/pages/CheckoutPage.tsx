import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCartSummary, useCheckout } from '../hooks/useCart';
import { Loader2, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartSummary, isLoading } = useGetCartSummary();
  const checkoutMutation = useCheckout();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');

  const handleCheckout = async () => {
    try {
      const orderId = await checkoutMutation.mutateAsync(paymentMethod);
      toast.success('Order placed successfully!');
      navigate({ to: `/order-confirmation/${orderId}` });
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!cartSummary || cartSummary.items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            {cartSummary.items.map((item) => (
              <div key={item.product.id.toString()} className="flex justify-between text-gray-700">
                <span>
                  {item.product.name} x {item.quantity.toString()}
                </span>
                <span>₹{(item.product.price * item.quantity).toString()}</span>
              </div>
            ))}
            <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold text-gray-900 text-lg">
              <span>Total</span>
              <span>₹{cartSummary.total.toString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="space-y-4">
            {/* Cash on Delivery */}
            <button
              onClick={() => setPaymentMethod('COD')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'COD'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Banknote className={`w-6 h-6 ${paymentMethod === 'COD' ? 'text-green-600' : 'text-gray-600'}`} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when you receive your order</div>
                </div>
              </div>
            </button>

            {/* UPI */}
            <button
              onClick={() => setPaymentMethod('UPI')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'UPI'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'UPI' ? 'text-green-600' : 'text-gray-600'}`} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">UPI Payment</div>
                  <div className="text-sm text-gray-600">Scan QR code to pay</div>
                </div>
              </div>
            </button>

            {/* UPI QR Code */}
            {paymentMethod === 'UPI' && (
              <div className="bg-white border-2 border-green-600 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-4">Scan this QR code with your UPI app to pay</p>
                <img
                  src="/assets/generated/upi-qr-placeholder.dim_200x200.png"
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto mb-4"
                />
                <p className="text-xs text-gray-500">After payment, click "Place Order" to confirm</p>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {checkoutMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Placing Order...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
