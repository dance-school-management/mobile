type FieldError = {
  field: string;
  message: string;
};
type FieldErrorArray = FieldError[];

interface UniversalError {
  statusCode: number;
  name: string;
  message: string;
  errors: FieldErrorArray;
}
