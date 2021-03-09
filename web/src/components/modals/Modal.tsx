import { ReactNode, useEffect } from 'react';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';

/** Skeleton component for Modals */

type ModalProps = {
  modalTitle: string;
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
    <div className="modal-container">
      <div className="modal-overlay" onClick={() => closeModal(dispatch)} />
      <div className="modal">
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button onClick={() => closeModal(dispatch)}>X</button>
        </div>
        {component}
      </div>
    </div>
  );
}
