import { fieldErrorFragment } from './fieldErrorFragment';

export const userFragment = `
{
  user {
    id
    sortedListsArray
  }
  ${fieldErrorFragment}
}
`;
