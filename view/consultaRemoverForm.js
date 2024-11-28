import PromptSync from "prompt-sync";

const prompt = PromptSync({ sigint: true });

export default function consultaRemoverForm() {
  let data, horaInicial;

  data = prompt("Data da consulta: ");
  horaInicial = prompt("Hora inicial: ");

  return { data: data, horaInicial: horaInicial };
}
