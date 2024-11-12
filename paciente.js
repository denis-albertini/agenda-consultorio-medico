import { horaFutura } from "./dataUtil.js";
import { DateTime } from "luxon";

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
      horaFinal: consulta.horaFinal,
      get status() {
        return horaFutura(this.data, this.horaFinal, DateTime.now());
      },
    };
  }

  constructor(cpf, nome, dataNascimento) {
    this.#cpf = cpf;
    this.#nome = nome;
    this.#dataNascimento = dataNascimento;
    this.#agendado = { status: false };
    this.#consultas = [];
  }
}
