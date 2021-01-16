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
        className="bg-darker opacity-50  absolute inset-0"
        onClick={() => closeModal(dispatch)}
      />
      <div className="justify-center items-center flex z-50 max-w-xs sm:max-w-md lg:max-w-xl xl:max-w-3xl">
        <div className="bg-darker border-light border-2 rounded-2xl flex flex-col p-8 gap-5">
          {/* Header */}
          <div className="flex justify-between pb-6 gap-8 border-b-2 border-light">
            <SubHeading>{modalTitle}</SubHeading>
            <button
              className="text-2xl pt-1  font-extrabold hover:text-light"
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
