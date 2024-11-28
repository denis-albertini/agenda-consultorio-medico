import PromptSync from "prompt-sync";

const prompt = PromptSync({ sigint: true });

export default function consultaRegistrarForm() {
  let data, horaInicial, horaFinal;

  data = prompt("Data da consulta: ");
  horaInicial = prompt("Hora inicial: ");
  horaFinal = prompt("Hora final: ");

  return { data: data, horaInicial: horaInicial, horaFinal: horaFinal };
}
