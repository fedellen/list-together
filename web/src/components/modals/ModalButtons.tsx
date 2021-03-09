type ModalButtonsProps = {
  primaryClick: () => void;
  secondaryClick: () => void;
  buttonText:
    | 'Remove'
    | 'Submit'
    | 'Share'
    | 'Add'
    | 'Create'
    | 'Update'
    | 'Rename';
};

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
