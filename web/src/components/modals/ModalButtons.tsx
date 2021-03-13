type ModalButtonsProps = {
  /** Function to run on primary button (usually a mutation) */
  primaryClick: () => void;
  /** Function to run on secondary button (usually CLEAR_STATE) */
  secondaryClick: () => void;
  /** Text to put in primary button */
  buttonText:
    | 'Remove'
    | 'Submit'
    | 'Share'
    | 'Add'
    | 'Create'
    | 'Update'
    | 'Rename';
};

/** Component with two buttons side by side, primary and secondary */
export default function ModalButtons({
  primaryClick,
  secondaryClick,
  buttonText
}: ModalButtonsProps) {
  return (
    <div className="modal-buttons">
      <button onClick={() => secondaryClick()} className="button-secondary">
        Cancel
      </button>
      <button onClick={() => primaryClick()} className="button">
        {buttonText}
      </button>
    </div>
  );
}
