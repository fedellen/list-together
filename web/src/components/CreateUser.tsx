import { Field, Form, Formik } from 'formik';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import { useCreateUserMutation } from '../generated/graphql';
import Button from './styled/Button';
import * as yup from 'yup';
import FormError from './styled/FormError';

export default function CreateUser() {
  const [createUser, { loading }] = useCreateUserMutation();
  const [, dispatch] = useStateValue();

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
    <div className="py-8 justify-center items-center flex flex-col">
      <h1 className="text-3xl font-semibold pb-4">Create User</h1>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          passwordConfirmation: ''
        }}
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
            /** Display any errors from server resolvers as global errors */
            if (response.data?.createUser.errors) {
              errorNotifaction(response.data.createUser.errors, dispatch);
            }
          } catch (err) {
            console.error('Error on createUser submission: ', err);
          }
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center p-2 gap-2 w-3/4"
          >
            <Field
              id="username"
              name="username"
              type="username"
              label="username"
              placeholder="username"
            />

            {errors.username && touched.username && (
              <FormError errorMessage={errors.username} />
            )}

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

            <Field
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              label="passwordConfirmation"
              placeholder="confirm password"
            />

            {errors.passwordConfirmation && touched.passwordConfirmation && (
              <FormError errorMessage={errors.passwordConfirmation} />
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
