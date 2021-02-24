import { FieldError } from '../response/FieldError';

/** Validate string length is between `min` and `max` characters, default => `min:2`, `max:30` */
export const validateStringLength = (
  string: string,
  min: number = 2,
  max: number = 30
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
