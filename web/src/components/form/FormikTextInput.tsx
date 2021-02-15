import { useField } from 'formik';

type FormikTextInputProps = {
  name: string;
  /** Placeholder will inherit name by default */
  placeholder?: string;
  /** Type will inheeit name by default */
  type?: string;
  /** Focus on render? */
  autoFocus?: boolean;
};

export default function FormikTextInput({
  name,
  placeholder,
  type,
  autoFocus = false
}: FormikTextInputProps) {
  const [field, meta] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <>
      <input
        {...field}
        placeholder={placeholder || name}
        type={type || name}
        autoFocus={autoFocus}
      />
      {showError && meta.error && (
        <span className="text-red-600">{meta.error}</span>
      )}
    </>
  );
}
