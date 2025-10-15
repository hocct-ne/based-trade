import orderBookApiRequest from "@/apiRequests/orderbook";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useOrderBookListQuery = () => {
  return useQuery({
    queryFn: orderBookApiRequest.getOrderList,
    queryKey: ["guest-orders"],
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: orderBookApiRequest.order,
  });
};
