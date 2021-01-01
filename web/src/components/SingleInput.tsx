import { Formik, Form, Field } from 'formik';

/** Single input component for mutations:
 * `addItem` | `createList` | `addNote` */

type SingleInputProps = {
  /** Function for handling the mutation */
  handleAdd: (arg: string) => void;
  /** String to put in the `placeholder` field */
  placeholderText: string;
};

export function SingleInput({ handleAdd, placeholderText }: SingleInputProps) {
  return (
    <Formik
      initialValues={{
        text: ''
      }}
      onSubmit={(values) => handleAdd(values.text)}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center p-2 gap-2"
        >
          <Field
            id="text"
            name="text"
            type="text"
            label="text"
            autoFocus={true}
            placeholder={placeholderText}
          />
          <button
            type="submit"
            className=" bg-darker px-6 py-4 my-2 border-4 border-medium border-solid  rounded-3xl hover:bg-medium hover:border-darker text-lg"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
