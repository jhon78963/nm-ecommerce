const PASSWORD_COMPLEXITY_PATTERN = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_HINT =
  "Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial.";

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && PASSWORD_COMPLEXITY_PATTERN.test(password);
}
