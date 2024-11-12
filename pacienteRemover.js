import { validaCpf } from "./validador.js";
import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });

export default function pacienteRemover(pacientes, consultas) {
  let cpf;

  while (1) {
    cpf = prompt("CPF: ");

    if (!validaCpf(cpf)) {
      console.log("\nErro: CPF inválido!\n");
      cpf = "";
      continue;
    }

    if (!pacientes.get(cpf)) {
      console.log("\nErro: paciente não cadastrado!\n");
      break;
    }

    if (pacientes.get(cpf).agendado != false) {
      console.log("\nErro: paciente está agendado!\n");
      break;
    }

    consultas.forEach((consulta) => {
      if (consulta.cpf === cpf)
        consultas.splice(consultas.indexOf(consulta), 1);
    });

    pacientes.delete(cpf);

    console.log("\nPaciente excluído com sucesso!\n");

    break;
  }
}
