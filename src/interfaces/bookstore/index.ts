import { BookInterface } from 'interfaces/book';
import { InventoryInterface } from 'interfaces/inventory';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BookstoreInterface {
  id?: string;
  description?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  book?: BookInterface[];
  inventory?: InventoryInterface[];
  user?: UserInterface;
  _count?: {
    book?: number;
    inventory?: number;
  };
}

export interface BookstoreGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
