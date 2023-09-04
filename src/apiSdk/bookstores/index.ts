import axios from 'axios';
import queryString from 'query-string';
import { BookstoreInterface, BookstoreGetQueryInterface } from 'interfaces/bookstore';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getBookstores = async (
  query?: BookstoreGetQueryInterface,
): Promise<PaginatedInterface<BookstoreInterface>> => {
  const response = await axios.get('/api/bookstores', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createBookstore = async (bookstore: BookstoreInterface) => {
  const response = await axios.post('/api/bookstores', bookstore);
  return response.data;
};

export const updateBookstoreById = async (id: string, bookstore: BookstoreInterface) => {
  const response = await axios.put(`/api/bookstores/${id}`, bookstore);
  return response.data;
};

export const getBookstoreById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bookstores/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBookstoreById = async (id: string) => {
  const response = await axios.delete(`/api/bookstores/${id}`);
  return response.data;
};
