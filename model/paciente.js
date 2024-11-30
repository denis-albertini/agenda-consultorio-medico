import Result from "./result.js";
import validador from "./validador.js";

export default class Paciente {
  #cpf;
  #nome;
  #dataNascimento;
  #agendado;
  #consultas;

  get cpf() {
    return this.#cpf;
  }
  get nome() {
    return this.#nome;
  }
  get dataNascimento() {
    return this.#dataNascimento;
  }
  get agendado() {
    return this.#agendado.status;
  }
  get consultas() {
    return this.#consultas;
  }

  set agendado(consulta) {
    this.#agendado = {
      data: consulta.data,
      horaInicial: consulta.horaInicial,
      get status() {
        const validaHoraFutura = validador.validarHoraFutura(
          this.horaInicial,
          this.data
        );
        if (validaHoraFutura.isFailure) return false;
        return true;
      },
    };
  }

  constructor(cpf, nome, dataNascimento) {
    const erros = [];

    const validaCpf = validador.validarCpf(cpf);
    if (validaCpf.isFailure) erros.push(...validaCpf.errors);
    cpf = validaCpf.value;

    const validaNome = validador.validarNome(nome);
    if (validaNome.isFailure) erros.push(...validaNome.errors);
    nome = validaNome.value;

    const validaDataNascimento =
      validador.validarDataNascimento(dataNascimento);
    if (validaDataNascimento.isFailure)
      erros.push(...validaDataNascimento.errors);
    dataNascimento = validaDataNascimento.value;

    if (erros.length > 0) return Result.failure(erros);

    this.#cpf = cpf;
    this.#nome = nome;
    this.#dataNascimento = dataNascimento;
    this.#agendado = { status: false };
    this.#consultas = [];

    return Result.success(this);
  }
}
