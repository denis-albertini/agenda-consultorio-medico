import { padraoData, padraoHora } from "./padroes.js";
import { dataFutura, dataHoraFutura } from "./dataUtil.js";
import Paciente from "./paciente.js";
import { DateTime } from "luxon";

export default class Consulta {
  #cpf;
  #data;
  #horaInicial;
  #horaFinal;

  get cpf() {
    return this.#cpf;
  }
  get data() {
    return this.#data;
  }
  get horaInicial() {
    return this.#horaInicial;
  }
  get horaFinal() {
    return this.#horaFinal;
  }

  set cpf(paciente) {
    if (paciente instanceof Paciente)
      if (!paciente.agendado) this.#cpf = paciente.cpf;
      else throw new Error("Erro: paciente já possui agendamento futuro!");
    else throw new Error("Erro: paciente não cadastrado!");
  }

  set data(data) {
    if (padraoData.test(data)) {
      data = DateTime.fromFormat(data, "dd/MM/yyyy");
      if (dataFutura(data)) this.#data = data;
      else throw new Error("Erro: data deve ser futura!");
    } else throw new Error("Erro: data deve estar no formato dd/MM/aaaa!");
  }

  set horaInicial(horaInicial) {
    if (padraoHora.test(horaInicial)) {
      horaInicial = DateTime.fromFormat(horaInicial, "HHmm");
      if (horaInicial.hour >= 8 && horaInicial.hour < 19)
        if (horaInicial.minute % 15 === 0)
          if (dataHoraFutura(this.data, horaInicial))
            this.#horaInicial = horaInicial;
          else throw new Error("Erro: hora inicial deve ser futura!");
        else throw new Error("Erro: hora deve estar no padrão de 15min!");
      else
        throw new Error(
          "Erro: horário de funcionamento do consultório é das 8:00 às 19:00!"
        );
    } else throw new Error("Erro: hora deve estar no formato HHMM!");
  }

  set horaFinal(horaFinal) {
    if (padraoHora.test(horaFinal)) {
      horaFinal = DateTime.fromFormat(horaFinal, "HHmm");
      if (horaFinal > this.horaInicial)
        if (horaFinal.hour < 19)
          if (horaFinal.minute % 15 === 0) this.#horaFinal = horaFinal;
          else throw new Error("Erro: hora deve estar no padrão de 15min!");
        else
          throw new Error(
            "Erro: horário de funcionamento do consultório é das 8:00 às 19:00!"
          );
      else throw new Error("Erro: hora final deve ser maior que hora inicial!");
    } else throw new Error("Erro: hora deve estar no formato HHMM!");
  }
}
