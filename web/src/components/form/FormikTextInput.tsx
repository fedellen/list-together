import { useField } from 'formik';
import FormError from '../styled/FormError';

type FormikTextInputProps = {
  name: string;
  /** Placeholder will inherit name by default */
  placeholder?: string;
  /** Type will inheeit name by default */
  type?: string;
};

export default function FormikTextInput({
  name,
  placeholder,
  type
}: FormikTextInputProps) {
  const [field, meta] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <>
      <input {...field} placeholder={placeholder || name} type={type || name} />
      {showError && meta.error && <FormError errorMessage={meta.error} />}
    </>
  );
}
