import { Form, Formik } from 'formik';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import { GetUserDocument, useLoginUserMutation } from '../../generated/graphql';
import Button from '../styled/Button';
import * as yup from 'yup';
import React from 'react';
import FormikTextInput from './FormikTextInput';

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
    <div className="form-container">
      <h2>Login</h2>
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
            } else {
              dispatch({ type: 'SET_APP_STATE', payload: 'list' });
            }
          } catch (err) {
            console.error('Error on login submission: ', err);
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="form">
            <FormikTextInput name="email" />
            <FormikTextInput name="password" />
            <Button type="submit" text="Login" isLoading={loading} />
          </Form>
        )}
      </Formik>
    </div>
  );
}
