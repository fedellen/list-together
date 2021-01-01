import { Field, Form, Formik } from 'formik';
import { GetUserDocument, useLoginUserMutation } from '../generated/graphql';

// type LoginProps = {
//   // setUser: (arg: string) => void;
// };

export function Login(/*{}: setUser LoginProps*/) {
  const [login, { loading }] = useLoginUserMutation();

  return (
    <div className="p-2 justify-center items-center flex flex-col">
      <h1 className="text-3xl font-semibold p-4">Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={async (values, actions) => {
          try {
            actions.setSubmitting(true);
            const {
              /*data*/
            } = await login({
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
            <button
              type="submit"
              className=" bg-darker px-6 py-4 my-2 border-4 border-medium border-solid  rounded-3xl hover:bg-medium hover:border-darker"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
