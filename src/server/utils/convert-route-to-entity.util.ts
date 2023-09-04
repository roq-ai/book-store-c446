const mapping: Record<string, string> = {
  books: 'book',
  bookstores: 'bookstore',
  inventories: 'inventory',
  orders: 'order',
  'order-items': 'order_item',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
