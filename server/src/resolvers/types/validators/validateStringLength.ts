import { maxCharacterLimit, minCharacterLimit } from '../../../constants';
import { FieldError } from '../response/FieldError';

/** Validate string length is between `min` and `max`, defaults to global constants */
export const validateStringLength = (
  string: string,
  min: number = minCharacterLimit,
  max: number = maxCharacterLimit
): FieldError[] | null => {
  if (string.length < min) {
    return [
      {
        field: 'text',
        message: `Text entry cannot contain less than ${min} characters..`
      }
    ];
  } else if (string.length > max) {
    return [
      {
        field: 'text',
        message: `Text entry cannot contain more than ${max} characters..`
      }
    ];
  } else {
    return null;
  }
};
