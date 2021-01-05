import { Field, Form, Formik } from 'formik';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import { GetUserDocument, useLoginUserMutation } from '../generated/graphql';
import Button from './Button';

export default function Login() {
  const [login, { loading }] = useLoginUserMutation();
  const [, dispatch] = useStateValue();

  return (
    <div className="p-2 justify-center items-center flex flex-col">
      <h1 className="text-3xl font-semibold p-4">Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={async (values) => {
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
              errorNotifaction(response.data.login.errors, dispatch);
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

            <Field
              id="password"
              name="password"
              type="password"
              label="password"
              placeholder="password"
            />

            <Button type="submit" text="Login" isLoading={loading} />
          </Form>
        )}
      </Formik>
    </div>
  );
}
