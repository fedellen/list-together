import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toErrorMap } from 'src/utils/toErrorMap';
import { GetUserDocument, useLoginUserMutation } from '../generated/graphql';
import Button from './Button';
import FormError from './FormError';

export default function Login() {
  const [login, { loading }] = useLoginUserMutation();

  return (
    <div className="p-2 justify-center items-center flex flex-col">
      <h1 className="text-3xl font-semibold p-4">Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const response = await login({
              variables: {
                data: {
                  email: values.email,
                  password: values.password
                }
              },
              /** Update cache when we have data */
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
            /** Display any errors from server resolvers */
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            }
          } catch (err) {
            console.error('Error on login submission: ', err);
          }
        }}
      >
        {({ handleSubmit }) => (
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
            <ErrorMessage
              name="email"
              render={(msg) => <FormError errorMessage={msg} />}
            />
            <Field
              id="password"
              name="password"
              type="password"
              label="password"
              placeholder="password"
            />
            <ErrorMessage
              name="password"
              render={(msg) => <FormError errorMessage={msg} />}
            />

            <Button type="submit" text="Login" isLoading={loading} />
          </Form>
        )}
      </Formik>
    </div>
  );
}
