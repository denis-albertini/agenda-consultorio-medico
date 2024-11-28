import agendaListar from "../controller/agendaListar.js";
import PromptSync from "prompt-sync";

const prompt = PromptSync();

export default function menuAgendaListar() {
  const opcao = prompt("Apresentar a agenda T-toda ou P-período: ");

  let dataInicial, dataFinal;
  const formulario = { opcao, dataInicial, dataFinal };

  switch (opcao.toUpperCase()) {
    case "T":
      formulario.opcao = opcao;
      break;
    case "P":
      dataInicial = prompt("Data inicial: ");
      dataFinal = prompt("Data final: ");
      formulario.opcao = opcao;
      formulario.dataInicial = dataInicial;
      formulario.dataFinal = dataFinal;
      break;
    default:
      formulario.opcao = "T";
      break;
  }

  agendaListar(formulario);
}
