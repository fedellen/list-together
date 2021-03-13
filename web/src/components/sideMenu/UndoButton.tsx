import { ReactNode, useEffect, useState } from 'react';
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
import IconButton from '../shared/IconButton';
import UndoButtonIcon from '../svg/sideMenu/UndoButtonIcon';

export default function UndoButton() {
  const [{ undoState }, dispatch] = useStateValue();

  /** Keyboard access for undo */
  const undoKey = useKeyPress('u', 'z');
  const keyCooldown = useDelayedFunction(() => {
    setKeyboardCooldown(false);
  });
  const useKeyCooldown = () => {
    setKeyboardCooldown(true);
    keyCooldown(100); // .1 second cooldown
  };
  const [keyboardCooldown, setKeyboardCooldown] = useState(false);
  let undoKeyboardButton = false;
  if (undoKey && !keyboardCooldown) {
    undoKeyboardButton = true;
  }

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
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'deleteNote':
      undoWithMutation = (
        <WithAddNote
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'addItem':
      undoWithMutation = (
        <WithDeleteItems
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'addNote':
      undoWithMutation = (
        <WithDeleteNote
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'sortItems':
      undoWithMutation = (
        <WithSortItems
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'sortLists':
      undoWithMutation = (
        <WithSortLists
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'strikeItem':
      undoWithMutation = (
        <WithStrikeItem
          nextUndo={nextUndo}
          dispatch={dispatch}
          keyboardSubmit={undoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;
  }

  return <>{undoWithMutation}</>;
}

type WithMutationProps = {
  nextUndo: UndoState;
  dispatch: React.Dispatch<Action>;
  useKeyCooldown: () => void;
  keyboardSubmit: boolean;
};

function WithAddItem({
  nextUndo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.addItem.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Undo action, an unexpected error has occurred..'
      ]);
      dispatch({ type: 'REMOVE_UNDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  useEffect(() => {
    if (keyboardSubmit && !mutationSubmitting) {
      useKeyCooldown();
      handleMutation();
    }
  }, [keyboardSubmit]);
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
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.addNote.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Undo action, that item no longer exists on this list..'
      ]);
      dispatch({ type: 'REMOVE_UNDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  useEffect(() => {
    if (keyboardSubmit && !mutationSubmitting) {
      useKeyCooldown();
      handleMutation();
    }
  }, [keyboardSubmit]);
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
  keyboardSubmit,
  useKeyCooldown
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
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Undo action, that item no longer exists on this list..'
      ]);
      dispatch({ type: 'REMOVE_UNDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  useEffect(() => {
    if (keyboardSubmit && !mutationSubmitting) {
      useKeyCooldown();
      handleMutation();
    }
  }, [keyboardSubmit]);
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
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.deleteNote.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Undo action, that item or note is no longer exists on this list..'
      ]);
      dispatch({ type: 'REMOVE_UNDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  useEffect(() => {
    if (keyboardSubmit && !mutationSubmitting) {
      useKeyCooldown();
      handleMutation();
    }
  }, [keyboardSubmit]);
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
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.sortItems.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Undo action, an unexpected error has occurred..'
      ]);
      dispatch({ type: 'REMOVE_UNDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  useEffect(() => {
    if (keyboardSubmit && !mutationSubmitting) {
      useKeyCooldown();
      handleMutation();
    }
  }, [keyboardSubmit]);
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
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.sortLists.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Undo action, an unexpected error has occurred..'
      ]);
      dispatch({ type: 'REMOVE_UNDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  useEffect(() => {
    if (keyboardSubmit && !mutationSubmitting) {
      useKeyCooldown();
      handleMutation();
    }
  }, [keyboardSubmit]);
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
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.strikeItem.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Undo action, that item no longer exists on the list..'
      ]);
      dispatch({ type: 'REMOVE_UNDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'UNDO_MUTATION' });
      mutationCooldown(500);
    }
  };
  useEffect(() => {
    if (keyboardSubmit && !mutationSubmitting) {
      useKeyCooldown();
      handleMutation();
    }
  }, [keyboardSubmit]);
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
      icon={<UndoButtonIcon />}
      onClick={useMutationHook}
      text={`Undo${largeScreen ? ' (Z)' : ''}`}
      style="side-menu-button"
    />
  );
}
