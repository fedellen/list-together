import { Formik, Form, Field } from 'formik';
import React from 'react';
// import { GetUserDocument } from 'src/generated/graphql';

type SingleInputProps = {
  purpose: 'addItem' | 'createList' | 'addNote';
  handleAdd: (arg: string) => void;
  handleExit: () => void;
};

export function SingleInput({
  purpose,
  handleAdd,
  handleExit
}: SingleInputProps) {
  let inputTitle = 'Add Item';
  let placeholderText = 'Enter item name';
  if (purpose === 'createList') {
    inputTitle = 'Create New List';
    placeholderText = 'Enter new list name';
  }
  if (purpose === 'addNote') {
    inputTitle = 'Add Note to Item';
    placeholderText = 'Write your note';
  }

  return (
    <>
      <div className="bg-darker opacity-70  overflow-x-hidden overflow-y-auto fixed inset-0" />
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0">
        <div className="relative w-auto my-6 mx-auto max-w-3xl bg-darker border-light border-8 rounded-lg flex flex-col p-6 gap-4 text-3xl z-20">
          {/*header*/}
          <div className="flex items-start justify-between pb-4 border-b-2 border-light border-gray-300 rounded-t">
            <h3 className="text-3xl font-semibold pl-4">{inputTitle}</h3>
            <button
              className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={handleExit}
            >
              <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none text-lighter">
                x
              </span>
            </button>
          </div>

          {/*input*/}
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
        </div>
      </div>
    </>
  );
}
