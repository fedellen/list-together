import { Form, Formik } from 'formik';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import { useCreateUserMutation } from '../../generated/graphql';
import Button from '../styled/Button';
import * as yup from 'yup';
import FormikTextInput from './FormikTextInput';
import { sendNotification } from 'src/utils/dispatchActions';

export default function CreateUser() {
  const [createUser, { loading }] = useCreateUserMutation();
  const [, dispatch] = useStateValue();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  const validationSchema = yup.object().shape({
    username: yup.string().min(3).max(25).required('A username is required..'),
    email: yup
      .string()
      .email('A valid email must be entered..')
      .required('A valid email must be entered..'),
    password: yup.string().min(3).required('Password must be provided..'),
    passwordConfirmation: yup
      .string()
      .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value;
      })
  });

  return (
    <div className="form-container">
      <h2>Create New User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const response = await createUser({
              variables: {
                data: {
                  username: values.username,
                  email: values.email,
                  password: values.password
                }
              }
            });
            if (response.data?.createUser.errors) {
              errorNotifaction(response.data.createUser.errors, dispatch);
            } else {
              sendNotification(dispatch, [
                'Confirmation email has been sent. Check your inbox shortly..'
              ]);
            }
          } catch (err) {
            console.error('Error on createUser submission: ', err);
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="form ">
            <FormikTextInput name="username" />
            <FormikTextInput name="email" placeholder="email address" />
            <FormikTextInput name="password" />
            <FormikTextInput
              name="passwordConfirmation"
              placeholder="confirm password"
              type="password"
            />
            <Button type="submit" text="Submit" isLoading={loading} />
          </Form>
        )}
      </Formik>
    </div>
  );
}
