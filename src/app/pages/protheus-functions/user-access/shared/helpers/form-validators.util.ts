const STRICT_ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

export class FormValidators {
  /**
   * Valida se o texto é alfanumérico e não possui espaços.
   */
  static alphaNumeric(val: string | null, fieldName: string, maxLen?: number) {
    if (!val) return null;

    if (/\s/.test(val) || !STRICT_ALPHANUMERIC_REGEX.test(val)) {
      return {
        kind: 'error',
        message: `${fieldName} não pode conter espaços ou caracteres especiais.`,
      };
    }

    if (maxLen && val.length > maxLen) {
      return {
        kind: 'error',
        message: `${fieldName} deve conter no máximo ${maxLen} caracteres.`,
      };
    }

    return null;
  }

  /**
   * Valida se o número informado é maior que zero.
   */
  static positiveNumber(val: number | null, fieldName = 'A Ação') {
    if (val !== null && val <= 0) {
      return {
        kind: 'error',
        message: `${fieldName} deve ser um número maior que zero.`,
      };
    }

    return null;
  }
}
