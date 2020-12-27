import { Field, Form, Formik } from 'formik';
// import { useEffect } from "react";
import {
  GetUserDocument,
  // GetUserQuery,
  useLoginUserMutation
  // UserFragmentFragmentDoc
} from '../generated/graphql';
import { Button } from './Button';

type LoginProps = {
  setUser: (arg: string) => void;
};

export function Login({ setUser }: LoginProps) {
  const [login, { loading }] = useLoginUserMutation();

  return (
    <div className="h-56">
      <h1>Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={async (values, actions) => {
          try {
            actions.setSubmitting(true);
            const { data } = await login({
              variables: {
                data: {
                  email: values.email,
                  password: values.password
                }
              },
              // Add cache update when we have data
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
            if (data) {
              if (data.login.user) setUser(data.login.user?.username);
            }
          } catch (err) {
            console.error('Error on login submission: ', err);
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
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
