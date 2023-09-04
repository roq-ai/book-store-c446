import { BookInterface } from 'interfaces/book';
import { BookstoreInterface } from 'interfaces/bookstore';
import { GetQueryInterface } from 'interfaces';

export interface InventoryInterface {
  id?: string;
  book_id: string;
  quantity: number;
  bookstore_id: string;
  created_at?: any;
  updated_at?: any;

  book?: BookInterface;
  bookstore?: BookstoreInterface;
  _count?: {};
}

export interface InventoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  book_id?: string;
  bookstore_id?: string;
}
