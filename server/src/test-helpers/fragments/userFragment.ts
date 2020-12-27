import { fieldErrorFragment } from './fieldErrorFragment';

export const userFragment = `
{
  user {
    id
    username
    email
    sortedListsArray
  }
  ${fieldErrorFragment}
}
`;
