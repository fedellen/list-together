import { Form, Formik } from 'formik';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import { useCreateUserMutation } from '../../generated/graphql';
import Button from '../styled/Button';
import * as yup from 'yup';
import SubHeading from '../styled/SubHeading';
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
    <div className="gap-6 bg-gray-200 rounded-lg shadow-md justify-center items-center flex flex-col p-6">
      <SubHeading>Create New User</SubHeading>
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
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-4"
          >
            <FormikTextInput name="username" />
            <FormikTextInput name="email" placeholder="email address" />
            <FormikTextInput name="password" />
            <FormikTextInput
              name="passwordConfirmation"
              placeholder="confirm password"
            />

            <div className="pt-2">
              <Button type="submit" text="Submit" isLoading={loading} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
