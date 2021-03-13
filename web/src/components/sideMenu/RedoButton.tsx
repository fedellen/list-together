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
import RedoButtonIcon from '../svg/sideMenu/RedoButtonIcon';

export default function RedoButton() {
  const [{ redoState }, dispatch] = useStateValue();

  /** Keyboard access for redo */
  const redoKey = useKeyPress('y');
  const keyCooldown = useDelayedFunction(() => {
    setKeyboardCooldown(false);
  });
  const useKeyCooldown = () => {
    setKeyboardCooldown(true);
    keyCooldown(100); // .1sec cooldown
  };
  const [keyboardCooldown, setKeyboardCooldown] = useState(false);
  let redoKeyboardButton = false;
  if (redoKey && !keyboardCooldown) {
    redoKeyboardButton = true;
  }

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
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'addNote':
      redoWithMutation = (
        <WithAddNote
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'deleteItems':
      redoWithMutation = (
        <WithDeleteItems
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'deleteNote':
      redoWithMutation = (
        <WithDeleteNote
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'sortItems':
      redoWithMutation = (
        <WithSortItems
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'sortLists':
      redoWithMutation = (
        <WithSortLists
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;

    case 'strikeItem':
      redoWithMutation = (
        <WithStrikeItem
          nextRedo={nextRedo}
          dispatch={dispatch}
          keyboardSubmit={redoKeyboardButton}
          useKeyCooldown={useKeyCooldown}
        />
      );
      break;
  }

  return <>{redoWithMutation}</>;
}

type WithMutationProps = {
  nextRedo: UndoState;
  dispatch: React.Dispatch<Action>;
  useKeyCooldown: () => void;
  keyboardSubmit: boolean;
};

function WithAddItem({
  nextRedo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.addItem.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Redo action, an unexpected error has occurred..'
      ]);
      dispatch({ type: 'REMOVE_REDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'REDO_MUTATION' });
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
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithAddNote({
  nextRedo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.addNote.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Redo action, that item or note no longer exists on this list..'
      ]);
      dispatch({ type: 'REMOVE_REDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'REDO_MUTATION' });
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
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithDeleteItems({
  nextRedo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Redo action, item(s) no longer exist on this list..'
      ]);
      dispatch({ type: 'REMOVE_REDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'REDO_MUTATION' });
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
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithDeleteNote({
  nextRedo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.deleteNote.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Redo action, item or note no longer exist on this list..'
      ]);
      dispatch({ type: 'REMOVE_REDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'REDO_MUTATION' });
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
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithSortItems({
  nextRedo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.sortItems.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Redo action, an unexpected error has occurred..'
      ]);
      dispatch({ type: 'REMOVE_REDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'REDO_MUTATION' });
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
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithSortLists({
  nextRedo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.sortLists.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Redo action, an unexpected error has occurred..'
      ]);
      dispatch({ type: 'REMOVE_REDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'REDO_MUTATION' });
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
    <RedoButtonInner
      useMutationHook={handleMutation}
      mutationSubmitting={mutationSubmitting}
    />
  );
}

function WithStrikeItem({
  nextRedo,
  dispatch,
  keyboardSubmit,
  useKeyCooldown
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
    const errors = data?.strikeItem.errors;
    if (errors) {
      console.log(errors);
      sendNotification(dispatch, [
        'Could not complete Redo action, that item no longer exists on this list..'
      ]);
      dispatch({ type: 'REMOVE_REDO' });
      mutationCooldown(500); // .5 sec delay
    } else {
      dispatch({ type: 'REDO_MUTATION' });
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
      icon={<RedoButtonIcon />}
      onClick={useMutationHook}
      text={`Redo${largeScreen ? ' (Y)' : ''}`}
      style="side-menu-button"
    />
  );
}
