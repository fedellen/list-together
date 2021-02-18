import { ReactNode, useEffect } from 'react';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';

/** Skeleton component for overlayed Modals */

type ModalProps = {
  modalTitle: ReactNode;
  /** Component to put in the `content` portion of the modal */
  component: ReactNode;
};

export default function Modal({ modalTitle, component }: ModalProps) {
  const [, dispatch] = useStateValue();

  const escapeModalKeyPress = useKeyPress('Escape');
  useEffect(() => {
    if (escapeModalKeyPress) closeModal(dispatch);
  }, [escapeModalKeyPress]);

  return (
    <div className="fixed inset-0 items-center justify-center flex z-20 top-20">
      {/* Dark screen overlay  */}
      <div
        className="bg-gray-900 opacity-60  absolute inset-0"
        onClick={() => closeModal(dispatch)}
      />
      <div className="bg-gray-300 rounded-lg flex flex-col py-8 px-5 sm:px-8 gap-4 shadow-md mx-4  z-50 max-w-s sm:max-w-md lg:max-w-2xl x  l:max-w-4xl justify-center items-center">
        {/* Header */}
        <div className="flex justify-between pb-4 md:pb-6 gap-16 sm:gap-20 lg:gap-24 w-full items-start ">
          {modalTitle}
          <button
            className="text-2xl sm:text-3xl font-heading  font-bold hover:text-indigo-700 outline-none"
            onClick={() => closeModal(dispatch)}
          >
            X
          </button>
        </div>
        {/* Content */}
        {component}
      </div>
      {/* </div> */}
    </div>
  );
}
