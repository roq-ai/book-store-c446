import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getBookById, updateBookById } from 'apiSdk/books';
import { bookValidationSchema } from 'validationSchema/books';
import { BookInterface } from 'interfaces/book';
import { BookstoreInterface } from 'interfaces/bookstore';
import { getBookstores } from 'apiSdk/bookstores';

function BookEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<BookInterface>(
    () => (id ? `/books/${id}` : null),
    () => getBookById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BookInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBookById(id, values);
      mutate(updated);
      resetForm();
      router.push('/books');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<BookInterface>({
    initialValues: data,
    validationSchema: bookValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Books',
              link: '/books',
            },
            {
              label: 'Update Book',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Book
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.title}
            label={'Title'}
            props={{
              name: 'title',
              placeholder: 'Title',
              value: formik.values?.title,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.author}
            label={'Author'}
            props={{
              name: 'author',
              placeholder: 'Author',
              value: formik.values?.author,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Price"
            formControlProps={{
              id: 'price',
              isInvalid: !!formik.errors?.price,
            }}
            name="price"
            error={formik.errors?.price}
            value={formik.values?.price}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="published_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Published Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.published_date ? new Date(formik.values?.published_date) : null}
              onChange={(value: Date) => formik.setFieldValue('published_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.isbn}
            label={'Isbn'}
            props={{
              name: 'isbn',
              placeholder: 'Isbn',
              value: formik.values?.isbn,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<BookstoreInterface>
            formik={formik}
            name={'bookstore_id'}
            label={'Select Bookstore'}
            placeholder={'Select Bookstore'}
            fetcher={getBookstores}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/books')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'book',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BookEditPage);
