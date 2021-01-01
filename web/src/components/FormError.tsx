type FormErrorProps = {
  errorMessage: string;
};

export default function FormError({ errorMessage }: FormErrorProps) {
  return (
    <span className="text-1xl font-semibold text-light">{errorMessage}</span>
  );
}
