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
        className="bg-gray-900 opacity-60  absolute inset-0"
        onClick={() => closeModal(dispatch)}
      />
      <div className="justify-center items-center flex z-50 max-w-xs sm:max-w-md lg:max-w-xl xl:max-w-3xl">
        <div className="bg-gray-300 rounded-lg flex flex-col py-8 px-5 sm:px-8 gap-4 shadow-md mx-2">
          {/* Header */}
          <div className="flex justify-between pb-4 gap-10 ">
            <h2>{modalTitle}</h2>
            <button
              className="text-1xl sm:text-2xl  font-extrabold hover:text-indigo-700 outline-none"
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
