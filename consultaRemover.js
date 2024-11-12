import { validaCpf, validaCancelamentoConsulta } from "./validador.js";
import { padraoData, padraoHora } from "./padroes.js";
import { DateTime } from "luxon";
import { horaFutura } from "./dataUtil.js";
import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });

export default function consultaRemover(pacientes, consultas) {
  let cpf = "";
  let data = "";
  let horaInicial;

  while (1) {
    if (!(cpf.length > 0)) cpf = prompt("");
    else console.log(`CPF: ${cpf}`);

    if (!validaCpf(cpf)) {
      console.log("\nErro: CPF inválido!\n");
      cpf = "";
      continue;
    }

    if (!pacientes.get(cpf)) {
      console.log("\nErro: paciente não cadastrado!\n");
      break;
    }

    if (!(data.length > 0)) data = prompt("Data da consulta: ");
    else console.log(`Data da consulta: ${data}`);

    if (!padraoData.test(data)) {
      console.log("\nErro: data deve estar no formato dd/MM/aaaa!\n");
      data = "";
      continue;
    }

    horaInicial = prompt("Hora inicial: ");

    if (!padraoHora.test(horaInicial)) {
      console.log("\nErro: hora deve estar no formato HHMM!\n");
      horaInicial = "";
      continue;
    }

    horaInicial = DateTime.fromFormat(horaInicial, "HHmm");

    if (
      !horaFutura(
        DateTime.fromFormat(data, "dd/MM/yyyy"),
        horaInicial,
        DateTime.now()
      )
    ) {
      console.log("Erro: agendamento inválido!");
      break;
    }

    if (
      !validaCancelamentoConsulta(
        cpf,
        DateTime.fromFormat(data, "dd/MM/yyyy"),
        horaInicial,
        consultas
      )
    ) {
      console.log("Erro: agendamento não encontrado!");
      break;
    }

    consultas.forEach((consulta) => {
      if (
        consulta.cpf === cpf &&
        consulta.data === DateTime.fromFormat(data, "dd/MM/yyyy") &&
        consulta.horaInicial === horaInicial
      )
        consultas.splice(consultas.indexOf(consulta), 1);
    });

    console.log("Agendamento cancelado com sucesso!");

    break;
  }
}
