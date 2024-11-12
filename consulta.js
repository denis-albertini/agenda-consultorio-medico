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
    this.#data = data;
    this.#horaInicial = horaInicial;
    this.#horaFinal = horaFinal;
    this.#paciente = paciente;
  }
}
