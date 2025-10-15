import http from "@/lib/http";
import { OrderBookType } from "@/types/orderbook.type";

const orderBookApiRequest = {
  order: (body: any) => http.post<any>("/guest/orders", body),
  getOrderList: () => http.get<OrderBookType>("/guest/orders"),
};

export default orderBookApiRequest;
