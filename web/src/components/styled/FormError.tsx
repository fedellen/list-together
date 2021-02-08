type FormErrorProps = {
  errorMessage: string;
};

export default function FormError({ errorMessage }: FormErrorProps) {
  return <span className="text-red-600">{errorMessage}</span>;
}
