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

export default function RedoButton() {
  const [{ redoState }, dispatch] = useStateValue();

  const redoKeyboardButton = useKeyPress('y');

  if (redoState.length < 1) return null;

  const nextRedo = redoState[redoState.length - 1];
  let redoWithMutation: ReactNode;

  switch (nextRedo[0]) {
    case 'addItem':
      redoWithMutation = (
        <WithAddItem
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
        />
      );
      break;

    case 'addNote':
      redoWithMutation = (
        <WithAddNote
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
        />
      );
      break;

    case 'deleteItems':
      redoWithMutation = (
        <WithDeleteItems
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
        />
      );
      break;

    case 'deleteNote':
      redoWithMutation = (
        <WithDeleteNote
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
        />
      );
      break;

    case 'sortItems':
      redoWithMutation = (
        <WithSortItems
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
        />
      );
      break;

    case 'sortLists':
      redoWithMutation = (
        <WithSortLists
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
        />
      );
      break;

    case 'strikeItem':
      redoWithMutation = (
        <WithStrikeItem
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
        />
      );
      break;
  }

  return <>{redoWithMutation}</>;
}

type WithMutationProps = {
  nextRedo: UndoState;
  dispatch: React.Dispatch<Action>;

  keyboardSubmit: boolean;
};

function WithAddItem({
  nextRedo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [addItem, { loading }] = useAddItemMutation();
  if (nextRedo[0] !== 'addItem') return null;
  const { listId, itemName } = nextRedo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await addItem({
      variables: { data: { listId, nameInput: [itemName] } }
    });
    if (data?.addItem.errors) {
      errorNotifaction(data.addItem.errors, dispatch);
      mutationCooldown();
    } else {
      dispatch({ type: 'REDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithAddNote({
  nextRedo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [addNote, { loading }] = useAddNoteMutation();
  if (nextRedo[0] !== 'addNote') return null;
  const { note, listId, itemName } = nextRedo[1];
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
      dispatch({ type: 'REDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithDeleteItems({
  nextRedo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [deleteItems, { loading }] = useDeleteItemsMutation();
  if (nextRedo[0] !== 'deleteItems') return null;
  const { listId, itemNameArray } = nextRedo[1];
  const handleMutation = async () => {
    if (loading || mutationSubmitting) return;
    setMutationSubmitting(true);
    const { data } = await deleteItems({
      variables: { data: { listId, itemNameArray } }
    });
    const errors = data?.deleteItems.errors;
    if (errors) {
      if (errors[0].field === 'itemName') {
        sendNotification(dispatch, [
          'Could not complete Redo action, that item has already been removed..'
        ]);
        dispatch({ type: 'REMOVE_REDO', payload: -1 }); // -1 removes last on array
        mutationCooldown(500); // .5 sec delay
      } else {
        errorNotifaction(errors, dispatch);
        mutationCooldown();
      }
    } else {
      dispatch({ type: 'REDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithDeleteNote({
  nextRedo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [deleteNote, { loading }] = useDeleteNoteMutation();
  if (nextRedo[0] !== 'deleteNote') return null;
  const { note, listId, itemName } = nextRedo[1];
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
      dispatch({ type: 'REDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithSortItems({
  nextRedo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [sortItems, { loading }] = useSortItemsMutation();
  if (nextRedo[0] !== 'sortItems') return null;
  const { listId, previousItemArray } = nextRedo[1];
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
      dispatch({ type: 'REDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithSortLists({
  nextRedo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [sortLists, { loading }] = useSortListsMutation();
  if (nextRedo[0] !== 'sortLists') return null;
  const { previousListArray } = nextRedo[1];
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
      dispatch({ type: 'REDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithStrikeItem({
  nextRedo,
  dispatch,
  keyboardSubmit
}: WithMutationProps) {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const [strikeItem, { loading }] = useStrikeItemMutation();
  if (nextRedo[0] !== 'strikeItem') return null;
  const { listId, itemName } = nextRedo[1];
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
      dispatch({ type: 'REDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  if (keyboardSubmit && !mutationSubmitting) handleMutation();
  return (
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

type RedoButtonInnerProps = {
  useMutationHook: () => Promise<void>;
  mutationSubmitting: boolean;
};

function RedoButtonInner({ useMutationHook }: RedoButtonInnerProps) {
  const largeScreen = window.innerWidth > 1024;

  return (
    <IconButton
      icon={<DeleteIcon />}
      onClick={useMutationHook}
      text={`Redo${largeScreen ? ' (Y)' : ''}`}
      style="side-menu-button"
    />
  );
}
