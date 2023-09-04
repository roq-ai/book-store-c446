import { BookInterface } from 'interfaces/book';
import { OrderInterface } from 'interfaces/order';
import { GetQueryInterface } from 'interfaces';

export interface OrderItemInterface {
  id?: string;
  quantity: number;
  book_id: string;
  order_id: string;
  created_at?: any;
  updated_at?: any;

  book?: BookInterface;
  order?: OrderInterface;
  _count?: {};
}

export interface OrderItemGetQueryInterface extends GetQueryInterface {
  id?: string;
  book_id?: string;
  order_id?: string;
}
