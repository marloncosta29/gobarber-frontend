import { ValidationError } from 'yup';

interface Erros {
  [x: string]: string;
}

export default function getValidationErrors(errors: ValidationError): Erros {
  const validationErros: Erros = {};
  errors.inner.forEach(e => {
    validationErros[e.path] = e.message;
  });
  return validationErros;
}
