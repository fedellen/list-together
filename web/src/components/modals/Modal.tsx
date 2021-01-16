import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';

/** Skeleton component for all overlayed Modals */

type ModalProps = {
  modalTitle: string;
  /** Component to put in the `content` portion of the modal */
  component: React.ReactNode;
};

export default function Modal({ modalTitle, component }: ModalProps) {
  const [, dispatch] = useStateValue();

  return (
    <div className="fixed inset-0 items-center justify-center flex z-20">
      {/* Dark screen overlay  */}
      <div
        className="bg-darker opacity-50  absolute inset-0"
        onClick={() => closeModal(dispatch)}
      />
      <div className="justify-center items-center flex z-50 max-w-xs sm:max-w-md lg:max-w-xl xl:max-w-3xl">
        <div className="bg-darker border-light border-2 rounded-2xl flex flex-col p-5 gap-4">
          {/* Header */}
          <div className="flex justify-between pb-2 border-b-2 border-light">
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
