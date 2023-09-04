import { InventoryInterface } from 'interfaces/inventory';
import { OrderItemInterface } from 'interfaces/order-item';
import { BookstoreInterface } from 'interfaces/bookstore';
import { GetQueryInterface } from 'interfaces';

export interface BookInterface {
  id?: string;
  title: string;
  author: string;
  price: number;
  published_date: any;
  isbn: string;
  bookstore_id: string;
  created_at?: any;
  updated_at?: any;
  inventory?: InventoryInterface[];
  order_item?: OrderItemInterface[];
  bookstore?: BookstoreInterface;
  _count?: {
    inventory?: number;
    order_item?: number;
  };
}

export interface BookGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  author?: string;
  isbn?: string;
  bookstore_id?: string;
}
