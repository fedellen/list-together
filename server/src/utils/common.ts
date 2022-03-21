import { minCharacterLimit, maxCharacterLimit } from '../constants';
import fieldError from '../services/fieldError';

export function parseStringInput(string: string): string {
  const trimmedString = trimWhiteSpaceFromString(string);
  validateString(trimmedString);
  return trimmedString;
}

function trimWhiteSpaceFromString(string: string): string {
  return string.trim();
}

function validateString(string: string): void {
  if (string.length < minCharacterLimit) {
    throw fieldError.nameIsTooShort;
  } else if (string.length > maxCharacterLimit) {
    throw fieldError.nameIsTooLong;
  }
}
