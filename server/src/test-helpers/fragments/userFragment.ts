import { fieldErrorFragment } from './fieldErrorFragment';

export const userFragment = `
{
  user {
    id
    email
    sortedListsArray
  }
  ${fieldErrorFragment}
}
`;
