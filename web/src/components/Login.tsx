import { Field, Form, Formik } from 'formik';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import { GetUserDocument, useLoginUserMutation } from '../generated/graphql';
import Button from './Button';
import * as yup from 'yup';
import FormError from './FormError';

export default function Login() {
  const [login, { loading }] = useLoginUserMutation();
  const [, dispatch] = useStateValue();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('A valid email must be entered..')
      .required('A valid email must be entered..'),
    password: yup.string().min(3).required('Password must be provided..')
  });

  return (
    <div className="py-8 justify-center items-center flex flex-col">
      <h1 className="text-3xl font-semibold pb-4">Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const response = await login({
              variables: {
                data: {
                  email: values.email,
                  password: values.password
                }
              },
              /** Update cache when we have successful login data */
              update: (cache, { data }) => {
                cache.writeQuery({
                  query: GetUserDocument,
                  data: {
                    __typename: 'Query',
                    getUser: data?.login.user
                  }
                });
              }
            });
            /** Display any errors from server resolvers as global errors */
            if (response.data?.login.errors) {
              errorNotifaction(response.data.login.errors, dispatch);
            }
          } catch (err) {
            console.error('Error on login submission: ', err);
          }
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center p-2 gap-2 w-3/4"
          >
            <Field
              id="email"
              name="email"
              type="email"
              label="email"
              placeholder="email address"
            />

            {errors.email && touched.email && (
              <FormError errorMessage={errors.email} />
            )}

            <Field
              id="password"
              name="password"
              type="password"
              label="password"
              placeholder="password"
            />

            {errors.password && touched.password && (
              <FormError errorMessage={errors.password} />
            )}
            <div className="pt-2">
              <Button type="submit" text="Login" isLoading={loading} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
