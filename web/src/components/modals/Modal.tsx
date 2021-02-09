import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import SubHeading from '../styled/SubHeading';

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
        <div className="bg-gray-300 rounded-lg flex flex-col p-8 gap-4 shadow-md">
          {/* Header */}
          <div className="flex justify-between pb-4 gap-10 ">
            <SubHeading>{modalTitle}</SubHeading>
            <button
              className="text-3xl pt-1  font-extrabold hover:text-indigo-700 outline-none"
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
