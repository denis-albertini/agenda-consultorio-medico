import Paciente from "./paciente.js";
import Result from "./result.js";
import {
  validarDataFutura,
  validarHoraInicial,
  validarHoraFinal,
} from "./validador.js";

export default class Consulta {
  #data;
  #horaInicial;
  #horaFinal;
  #paciente;

  get data() {
    return this.#data;
  }
  get horaInicial() {
    return this.#horaInicial;
  }
  get horaFinal() {
    return this.#horaFinal;
  }
  get paciente() {
    return this.#paciente;
  }

  constructor(data, horaInicial, horaFinal, paciente) {
    const erros = [];

    const validaData = validarDataFutura(data);
    if (validaData.isFailure) erros.push(...validaData.errors);
    data = validaData.value;

    const validahoraInicial = validarHoraInicial(horaInicial, data);
    if (validahoraInicial.isFailure) erros.push(...validahoraInicial.errors);
    horaInicial = validahoraInicial.value.hora;

    const validaHoraFinal = validarHoraFinal(horaFinal, horaInicial);
    if (validaHoraFinal.isFailure) erros.push(...validaHoraFinal.errors);
    horaFinal = validaHoraFinal.value.horaFinal;

    if (!(paciente instanceof Paciente)) erros.push(12);

    if (erros.length > 0) return Result.failure(erros);

    this.#data = data;
    this.#horaInicial = horaInicial;
    this.#horaFinal = horaFinal;
    this.#paciente = paciente;

    return Result.success(this);
  }
}
