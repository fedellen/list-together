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
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  if (undoState.length < 1) return null;

  const nextUndo = undoState[undoState.length - 1];
  let undoWithMutation: ReactNode;

  switch (nextUndo[0]) {
    case 'deleteItems':
      undoWithMutation = (
        <WithAddItem
          nextUndo={nextUndo}
          dispatch={dispatch}
          mutationSubmitting={mutationSubmitting}
          setMutationSubmitting={setMutationSubmitting}
          mutationCooldown={mutationCooldown}
        />
      );
      break;

    case 'deleteNote':
      undoWithMutation = (
        <WithAddNote
          nextUndo={nextUndo}
          dispatch={dispatch}
          setMutationSubmitting={setMutationSubmitting}
          mutationSubmitting={mutationSubmitting}
          mutationCooldown={mutationCooldown}
        />
      );
      break;

    case 'addItem':
      undoWithMutation = (
        <WithDeleteItems
          nextUndo={nextUndo}
          dispatch={dispatch}
          setMutationSubmitting={setMutationSubmitting}
          mutationSubmitting={mutationSubmitting}
          mutationCooldown={mutationCooldown}
        />
      );
      break;

    case 'addNote':
      undoWithMutation = (
        <WithDeleteNote
          nextUndo={nextUndo}
          dispatch={dispatch}
          setMutationSubmitting={setMutationSubmitting}
          mutationSubmitting={mutationSubmitting}
          mutationCooldown={mutationCooldown}
        />
      );
      break;

    case 'sortItems':
      undoWithMutation = (
        <WithSortItems
          nextUndo={nextUndo}
          dispatch={dispatch}
          setMutationSubmitting={setMutationSubmitting}
          mutationSubmitting={mutationSubmitting}
          mutationCooldown={mutationCooldown}
        />
      );
      break;

    case 'sortLists':
      undoWithMutation = (
        <WithSortLists
          nextUndo={nextUndo}
          dispatch={dispatch}
          setMutationSubmitting={setMutationSubmitting}
          mutationSubmitting={mutationSubmitting}
          mutationCooldown={mutationCooldown}
        />
      );
      break;

    case 'strikeItem':
      undoWithMutation = (
        <WithStrikeItem
          nextUndo={nextUndo}
          dispatch={dispatch}
          setMutationSubmitting={setMutationSubmitting}
          mutationSubmitting={mutationSubmitting}
          mutationCooldown={mutationCooldown}
        />
      );
      break;
  }

  return <>{undoWithMutation}</>;
}

type WithMutationProps = {
  nextUndo: UndoState;
  dispatch: React.Dispatch<Action>;
  mutationSubmitting: boolean;
  setMutationSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  mutationCooldown: (delay?: number) => void;
};

function WithAddItem({
  nextUndo,
  dispatch,
  mutationSubmitting,
  mutationCooldown,
  setMutationSubmitting
}: WithMutationProps) {
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
  mutationSubmitting,
  mutationCooldown,
  setMutationSubmitting
}: WithMutationProps) {
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
  mutationSubmitting,
  mutationCooldown,
  setMutationSubmitting
}: WithMutationProps) {
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
  mutationSubmitting,
  mutationCooldown,
  setMutationSubmitting
}: WithMutationProps) {
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
  mutationSubmitting,
  mutationCooldown,
  setMutationSubmitting
}: WithMutationProps) {
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
  mutationSubmitting,
  mutationCooldown,
  setMutationSubmitting
}: WithMutationProps) {
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
  mutationSubmitting,
  mutationCooldown,
  setMutationSubmitting
}: WithMutationProps) {
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

function UndoButtonInner({
  useMutationHook,
  mutationSubmitting
}: UndoButtonInnerProps) {
  const largeScreen = window.innerWidth > 1024;

  const undoKeyboardButton = useKeyPress('u', 'z');
  if (undoKeyboardButton && !mutationSubmitting) useMutationHook();

  return (
    <IconButton
      icon={<DeleteIcon />}
      onClick={useMutationHook}
      text={`Undo${largeScreen ? ' (Z)' : ''}`}
      style="side-menu-button"
    />
  );
}
