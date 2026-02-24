import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order } from '../backend';

export function useGetOrder(orderId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['orders', orderId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getOrder(orderId);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}
