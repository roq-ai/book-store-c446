import * as yup from 'yup';

export const inventoryValidationSchema = yup.object().shape({
  quantity: yup.number().integer().required(),
  book_id: yup.string().nullable().required(),
  bookstore_id: yup.string().nullable().required(),
});
