import { ReactNode, useEffect } from 'react';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';

type ModalProps = {
  /** Title for modal header: <h2> */
  modalTitle: string;
  /** Component to put in the `content` portion of the modal */
  component: ReactNode;
};

/** Skeleton component for all Modals */
export default function Modal({ modalTitle, component }: ModalProps) {
  const [, dispatch] = useStateValue();

  const escapeModalKeyPress = useKeyPress('Escape');
  useEffect(() => {
    if (escapeModalKeyPress) dispatch({ type: 'CLEAR_STATE' });
  }, [escapeModalKeyPress]);

  return (
    <div className="modal-container">
      <div
        className="modal-overlay"
        onClick={() => dispatch({ type: 'CLEAR_STATE' })}
      />
      <div className="modal">
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button onClick={() => dispatch({ type: 'CLEAR_STATE' })}>X</button>
        </div>
        {component}
      </div>
    </div>
  );
}
