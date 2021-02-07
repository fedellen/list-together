export type SubscriptionPayload = {
  updatedListId: string;
  userIdToExclude?: string;
  userIdToShare?: string;
  /** Message to display on front end */
  notification?: string;
};
