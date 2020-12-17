import { Field, Form, Formik } from 'formik';
// import { useEffect } from "react";
import {
  GetUserDocument,
  // GetUserQuery,
  useLoginUserMutation
  // UserFragmentFragmentDoc
} from '../generated/graphql';

export function Login() {
  const [login] = useLoginUserMutation();

  return (
    <div>
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
              variables: values,
              // Add cache update when we have data
              update: (cache, { data }) => {
                cache.writeQuery({
                  query: GetUserDocument,
                  data: {
                    __typename: 'Query',
                    getUser: data?.login
                  }
                });
              }
            });
            if (data) {
              console.log(JSON.stringify({ data }, null, 4));
              actions.resetForm();
            }
          } catch (err) {
            console.error('Error on login submission: ', err);
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              id='email'
              name='email'
              type='email'
              placeholder='email address'
            />
            <Field
              id='password'
              name='password'
              type='password'
              placeholder='password'
            />
            <button type='submit'>Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
