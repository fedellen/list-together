import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/closeModal';

type ModalProps = {
  modalTitle: string;
  /** Component to put in the `content` portion of the modal */
  component: React.ReactNode;
};

export default function Modal({ modalTitle, component }: ModalProps) {
  const [, dispatch] = useStateValue();

  return (
    <div className="fixed inset-0 items-center justify-center flex">
      {/* Dark screen overlay  */}
      <div
        className="bg-darker opacity-50  absolute inset-0"
        onClick={() => closeModal(dispatch)}
      />
      <div className="justify-center  items-center flex z-50 inset-0 ">
        <div className=" w-auto my-6 mx-auto max-w-md   bg-darker border-light border-4 rounded-lg flex flex-col p-6 gap-4 text-3xl">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-light border-gray-300 rounded-t">
            <h3 className="text-3xl font-semibold py-2 px-4">{modalTitle}</h3>
            <button
              className="py-2 px-4 text-3xl  font-extrabold hover:text-light"
              onClick={() => closeModal(dispatch)}
            >
              X
            </button>
          </div>
          {/* Content */}
          {component}
        </div>
      </div>
    </div>
  );
}
