import { ReactNode, useState } from 'react';
import {
  useAddItemMutation,
  useAddNoteMutation,
  useDeleteItemsMutation,
  useDeleteNoteMutation,
  useSortItemsMutation,
  useSortListsMutation,
  useStrikeItemMutation
} from 'src/generated/graphql';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import useKeyPress from 'src/hooks/useKeyPress';
import { Action } from 'src/state/reducer';
import { useStateValue } from 'src/state/state';
import { UndoState } from 'src/types';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import IconButton from '../shared/IconButton';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';

export default function UndoButton() {
  const [{ undoState }, dispatch] = useStateValue();

  const undoKeyboardButton = useKeyPress('u', 'z');

  if (undoState.length < 1) return null;

  const nextUndo = undoState[undoState.length - 1];
  let undoWithMutation: ReactNode;

  switch (nextUndo[0]) {
    case 'deleteItems':
      undoWithMutation = (
        <WithAddItem
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
        />
      );
      break;

    case 'deleteNote':
      undoWithMutation = (
        <WithAddNote
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
        />
      );
      break;

    case 'addItem':
      undoWithMutation = (
        <WithDeleteItems
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
        />
      );
      break;

    case 'addNote':
      undoWithMutation = (
        <WithDeleteNote
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
        />
      );
      break;

    case 'sortItems':
      undoWithMutation = (
        <WithSortItems
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
        />
      );
      break;

    case 'sortLists':
      undoWithMutation = (
        <WithSortLists
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
        />
      );
      break;

    case 'strikeItem':
      undoWithMutation = (
        <WithStrikeItem
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
        />
      );
      break;
  }

  return <>{undoWithMutation}</>;
}

type WithMutationProps = {
  nextUndo: UndoState;
  dispatch: React.Dispatch<Action>;

  keyboardSubmit: boolean;
};

function WithAddItem({
  nextUndo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [addItem, { loading }] = useAddItemMutation();
  if (nextUndo[0] !== 'deleteItems') return null;
  const { listId, itemNameArray } = nextUndo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await addItem({
      variables: { data: { listId, nameInput: itemNameArray } }
    });
    if (data?.addItem.errors) {
      errorNotifaction(data.addItem.errors, dispatch);
      mutationCooldown();
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <UndoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithAddNote({
  nextUndo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [addNote, { loading }] = useAddNoteMutation();
  if (nextUndo[0] !== 'deleteNote') return null;
  const { note, listId, itemName } = nextUndo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await addNote({
      variables: { data: { note, listId, itemName } }
    });
    if (data?.addNote.errors) {
      errorNotifaction(data.addNote.errors, dispatch);
      mutationCooldown();
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <UndoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithDeleteItems({
  nextUndo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [deleteItems, { loading }] = useDeleteItemsMutation();
  if (nextUndo[0] !== 'addItem') return null;
  const { listId, itemName } = nextUndo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await deleteItems({
      variables: { data: { listId, itemNameArray: [itemName] } }
    });
    const errors = data?.deleteItems.errors;
    if (errors) {
      if (errors[0].field === 'itemName') {
        sendNotification(dispatch, [
          'Could not complete Undo action, that item has already been removed..'
        ]);
        dispatch({ type: 'REMOVE_UNDO' });
        mutationCooldown(500); // .5 sec delay
      } else {
        errorNotifaction(errors, dispatch);
        mutationCooldown();
      }
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <UndoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithDeleteNote({
  nextUndo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [deleteNote, { loading }] = useDeleteNoteMutation();
  if (nextUndo[0] !== 'addNote') return null;
  const { note, listId, itemName } = nextUndo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await deleteNote({
      variables: { data: { note, listId, itemName } }
    });
    if (data?.deleteNote.errors) {
      errorNotifaction(data.deleteNote.errors, dispatch);
      mutationCooldown();
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <UndoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithSortItems({
  nextUndo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [sortItems, { loading }] = useSortItemsMutation();
  if (nextUndo[0] !== 'sortItems') return null;
  const { listId, previousItemArray } = nextUndo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await sortItems({
      variables: { data: { stringArray: previousItemArray }, listId }
    });
    if (data?.sortItems.errors) {
      errorNotifaction(data.sortItems.errors, dispatch);
      mutationCooldown();
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <UndoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithSortLists({
  nextUndo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [sortLists, { loading }] = useSortListsMutation();
  if (nextUndo[0] !== 'sortLists') return null;
  const { previousListArray } = nextUndo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await sortLists({
      variables: { data: { stringArray: previousListArray } }
    });
    if (data?.sortLists.errors) {
      errorNotifaction(data.sortLists.errors, dispatch);
      mutationCooldown();
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <UndoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithStrikeItem({
  nextUndo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [strikeItem, { loading }] = useStrikeItemMutation();
  if (nextUndo[0] !== 'strikeItem') return null;
  const { listId, itemName } = nextUndo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await strikeItem({
      variables: { data: { listId, itemName } }
    });
    if (data?.strikeItem.errors) {
      errorNotifaction(data.strikeItem.errors, dispatch);
      mutationCooldown();
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <UndoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

type UndoButtonInnerProps = {
  useMutationHook: () => Promise<void>;
  mutationSubmitting: boolean;
};

function UndoButtonInner({ useMutationHook }: UndoButtonInnerProps) {
  const largeScreen = window.innerWidth > 1024;

  return (
    <IconButton
      icon={<DeleteIcon />}
      onClick={useMutationHook}
      text={`Undo${largeScreen ? ' (Z)' : ''}`}
      style="side-menu-button"
    />
  );
}
