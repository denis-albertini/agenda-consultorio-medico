export default class Result {
  constructor(isSuccess, value, errors = []) {
    this.isSuccess = isSuccess;
    this.value = value;
    this.errors = errors;

    Object.freeze(this); // Torna o objeto imutável
  }

  // Método factory para sucesso
  static success(value) {
    return new Result(true, value, []);
  }

  // Método factory para falha
  static failure(errors) {
    return new Result(false, null, Array.isArray(errors) ? errors : [errors]);
  }

  // Indica se o resultado foi uma falha
  get isFailure() {
    return !this.isSuccess;
  }

  // Retorna um novo Result com um erro adicional
  addError(error) {
    if (this.isSuccess) return this;
    return new Result(false, null, [...this.errors, error]);
  }

  // Combina os erros com os de outro Result
  mergeErrors(result) {
    if (this.isSuccess) return result;
    if (result.isSuccess) return this;
    return new Result(false, null, [...this.errors, ...result.errors]);
  }
}
