type ModalProps = {
  /** Title to display on modal header */
  title: string;
  /** Function to handle closing the modal */
  exit: () => void;
  /** Component to put in the `content` portion of the modal */
  component: React.ReactNode;
};

export function Modal({ title, exit, component }: ModalProps) {
  return (
    <>
      {/** Dark screen overlay  */}
      <div
        className="bg-darker opacity-70  overflow-x-hidden overflow-y-auto fixed z-10 inset-0"
        onClick={exit}
      />
      <div className="justify-center items-center flex inset-0 absolute">
        <div className="relative w-auto my-6 mx-auto max-w-3xl bg-darker border-light border-8 rounded-lg flex flex-col p-6 gap-4 text-3xl z-20">
          {/*header*/}
          <div className="flex items-start justify-between pb-4 border-b-2 border-light border-gray-300 rounded-t">
            <h3 className="text-3xl font-semibold">{title}</h3>
            <button
              className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={exit}
            >
              <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none text-lighter">
                x
              </span>
            </button>
          </div>
          {/*content*/}
          {component}
        </div>
      </div>
    </>
  );
}
