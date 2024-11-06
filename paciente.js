import { padraoCpf, padraoNome, padraoData } from "./padroes.js";
import { dataHoraFutura } from "./dataUtil.js";
import { DateTime } from "luxon";

export default class Paciente {
  #cpf;
  #nome;
  #dataNascimento;
  #agendado = false;

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
    return this.#agendado;
  }

  set cpf(cpf) {
    let J = (() => {
      let sum = 0;
      for (let i = 0; i <= 8; i++) sum += Number(cpf[i]) * Math.abs(i - 10);
      if (sum % 11 === 0 || sum % 11 === 1) return 0;
      else if (sum % 11 >= 2 || sum % 11 <= 10) return 11 - (sum % 11);
      else return null;
    })();
    let K = (() => {
      let sum = 0;
      for (let i = 0; i <= 9; i++) sum += Number(cpf[i]) * Math.abs(i - 11);
      if (sum % 11 === 0 || sum % 11 === 1) return 0;
      else if (sum % 11 >= 2 || sum % 11 <= 10) return 11 - (sum % 11);
      else return null;
    })();

    if (padraoCpf.test(cpf) && cpf[9] == J && cpf[10] == K) this.#cpf = cpf;
    else throw new Error("Erro: CPF inválido!");
  }

  set nome(nome) {
    if (padraoNome.test(nome)) this.#nome = nome;
    else throw new Error("Erro: nome inválido!");
  }

  set dataNascimento(dataNascimento) {
    if (padraoData.test(dataNascimento)) {
      dataNascimento = DateTime.fromFormat(dataNascimento, "dd/MM/yyyy");
      if (DateTime.now().diff(dataNascimento, "years").years >= 13)
        this.#dataNascimento = dataNascimento;
      else throw new Error("Erro: paciente deve ter pelo menos 13 anos!");
    } else throw new Error("Erro: data deve estar no formato (dd/MM/aaaa)!");
  }

  set agendado(consulta) {
    this.#agendado = {
      data: consulta.data,
      horaFinal: consulta.horaFinal,
      get status() {
        return dataHoraFutura(this.data, this.horaFinal);
      },
    };
  }
}
