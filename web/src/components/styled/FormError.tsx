type FormErrorProps = {
  errorMessage: string;
};

export default function FormError({ errorMessage }: FormErrorProps) {
  return <div className="text-light text-xl font-semibold">{errorMessage}</div>;
}
