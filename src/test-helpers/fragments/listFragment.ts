import { itemFragment } from './itemFragment';

export const listFragment = `
  list {
    id
    title
    items {
      ${itemFragment}
    }
  }
`;
