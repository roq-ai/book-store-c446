import * as yup from 'yup';

export const bookValidationSchema = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  price: yup.number().integer().required(),
  published_date: yup.date().required(),
  isbn: yup.string().required(),
  bookstore_id: yup.string().nullable().required(),
});
