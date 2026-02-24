import { Minus, Plus, Trash2 } from 'lucide-react';
import { useUpdateCartQuantity, useRemoveFromCart } from '../hooks/useCart';
import type { CartItem as CartItemType } from '../backend';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeItemMutation = useRemoveFromCart();

  const handleUpdateQuantity = async (newQuantity: bigint) => {
    if (newQuantity < BigInt(1)) return;
    try {
      await updateQuantityMutation.mutateAsync({
        productId: item.product.id,
        quantity: newQuantity,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeItemMutation.mutateAsync(item.product.id);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
      <img
        src={item.product.image.getDirectURL()}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-lg">{item.product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.product.category}</p>
        <p className="text-lg font-bold text-gray-900">₹{item.product.price.toString()}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          disabled={removeItemMutation.isPending}
          className="text-red-600 hover:text-red-700 disabled:text-gray-400"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - BigInt(1))}
            disabled={updateQuantityMutation.isPending || item.quantity <= BigInt(1)}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold">{item.quantity.toString()}</span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + BigInt(1))}
            disabled={updateQuantityMutation.isPending}
            className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-lg font-bold text-gray-900">₹{subtotal.toString()}</p>
      </div>
    </div>
  );
}
