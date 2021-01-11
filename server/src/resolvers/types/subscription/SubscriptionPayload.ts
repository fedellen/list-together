export type SubscriptionPayload = {
  updatedListId: string; // uuid
  userIdToShare?: string; // uuid
  /** Message to display on front end */
  notification?: string;
};
