import Consulta from "./consulta.js";
import { dataHoraFutura } from "./dataUtil.js";

export default class Agenda {
  #consultas;

  get consultas() {
    return this.#consultas;
  }

  constructor() {
    this.#consultas = [];
  }

  adicionarConsulta(consulta) {
    if (consulta instanceof Consulta) {
      this.consultas.forEach((outraConsulta) => {
        if (dataHoraFutura(outraConsulta.data, outraConsulta.horaInicial))
          if (consulta.data.equals(outraConsulta.data))
            if (
              (consulta.horaInicial >= outraConsulta.horaInicial &&
                consulta.horaInicial <= outraConsulta.horaFinal) ||
              (consulta.horaFinal >= outraConsulta.horaInicial &&
                consulta.horaFinal <= outraConsulta.horaFinal)
            )
              throw new Error(
                "Erro: já existe uma consulta agendada nesse horário!"
              );
      });
      this.consultas.push(consulta);
      return true;
    } else throw new Error("Erro: objeto não é uma consulta!");
  }

  removerConsulta(cpf, data, horaInicial) {
    this.consultas.forEach((consulta) => {
      if (
        consulta.cpf === cpf &&
        consulta.data === data &&
        consulta.horaInicial === horaInicial
      )
        if (dataHoraFutura(consulta.data, consulta.horaInicial)) {
          this.consultas.splice(this.consultas.indexOf(consulta), 1);
          return true;
        } else return false;
    });
    throw new Error("Erro: agendamento não encontrado!");
  }

  apagarHistorico(paciente) {
    this.consultas.forEach((consulta) => {
      if (consulta.cpf === paciente.cpf)
        this.consultas.splice(this.consultas.indexOf(consulta), 1);
    });
  }
}
