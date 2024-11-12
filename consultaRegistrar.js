import {
  validaCpf,
  validaHoraInicial,
  validaHoraFinal,
  validaNovaConsulta,
} from "./validador.js";
import { padraoData, padraoHora } from "./padroes.js";
import { dataFutura } from "./dataUtil.js";
import { DateTime } from "luxon";
import Consulta from "./consulta.js";
import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });

export default function consultaRegistrar(consultas, pacientes) {
  let cpf = "";
  let data = "";
  let horaInicial = "";
  let horaFinal;
  let consulta;

  while (1) {
    if (!(cpf.length > 0)) cpf = prompt("CPF: ");
    else console.log(`CPF: ${cpf}`);

    if (!validaCpf(cpf)) {
      console.log("\nErro: CPF inválido!\n");
      cpf = "";
      continue;
    }

    if (pacientes.get(cpf).agendado) {
      console.log("\nErro: paciente já está agendado!");
      break;
    }

    if (!(data.length > 0)) data = prompt("Data da consulta: ");
    else console.log(`Data da consulta: ${data}`);

    if (!padraoData.test(data)) {
      console.log("\nErro: data deve estar no formato dd/MM/aaaa!\n");
      data = "";
      continue;
    }

    if (!dataFutura(DateTime.fromFormat(data, "dd/MM/yyyy"), DateTime.now())) {
      console.log("\nErro: data inválida!\n");
      data = "";
      continue;
    }

    if (!(horaInicial.length > 0)) horaInicial = prompt("Hora inicial: ");
    else console.log(`Hora inicial: ${horaInicial}`);

    if (!padraoHora.test(horaInicial)) {
      console.log("\nErro: hora deve estar no formato HHMM!\n");
      horaInicial = "";
      continue;
    }

    if (
      !validaHoraInicial(
        DateTime.fromFormat(data, "dd/MM/yyyy"),
        DateTime.fromFormat(horaInicial, "HHmm"),
        DateTime.now()
      )
    ) {
      console.log("\nErro: hora inválida!\n");
      horaInicial = "";
      continue;
    }

    horaFinal = prompt("Hora final: ");

    if (!padraoHora.test(horaFinal)) {
      console.log("\nErro: hora deve estar no formato HHMM!\n");
      horaFinal = "";
      continue;
    }

    if (
      !validaHoraFinal(
        DateTime.fromFormat(horaInicial, "HHmm"),
        DateTime.fromFormat(horaFinal, "HHmm")
      )
    ) {
      console.log("\nErro: hora inválida\n");
      continue;
    }

    if (
      !validaNovaConsulta(
        DateTime.fromFormat(data, "dd/MM/yyyy"),
        DateTime.fromFormat(horaInicial, "HHmm"),
        DateTime.fromFormat(horaFinal, "HHmm"),
        DateTime.now(),
        consultas
      )
    ) {
      console.log("\nErro: já existe uma consulta agendada nesse horário!\n");
      break;
    }

    consulta = new Consulta(
      DateTime.fromFormat(data, "dd/MM/yyyy"),
      DateTime.fromFormat(horaInicial, "HHmm"),
      DateTime.fromFormat(horaFinal, "HHmm"),
      pacientes.get(cpf)
    );

    consultas.push(consulta);

    pacientes.get(cpf).agendado = consulta;
    pacientes.get(cpf).consultas.push(consulta);

    console.log("\nAgendamento realizado com sucesso!\n");

    break;
  }
}
