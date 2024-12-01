import pacienteRegistrar from "../controller/pacienteRegistrar.js";
import pacienteRemover from "../controller/pacienteRemover.js";
import consultaRegistrar from "../controller/consultaRegistrar.js";
import consultaRemover from "../controller/consultaRemover.js";
import PromptSync from "prompt-sync";

const prompt = PromptSync({ sigint: true });

export default function cpfForm(opcao) {
  const cpf = prompt("CPF: ");

  const formulario = { cpf: cpf };

  switch (opcao) {
    case 1.1:
      pacienteRegistrar(formulario);
      break;
    case 1.2:
      pacienteRemover(formulario);
      break;
    case 2.1:
      consultaRegistrar(formulario);
      break;
    case 2.2:
      consultaRemover(formulario);
      break;
    default:
      break;
  }
}
