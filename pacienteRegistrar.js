import Paciente from "./paciente.js";
import { padraoNome, padraoData } from "./padroes.js";
import { validaCpf, validaDataNascimento } from "./validador.js";
import { DateTime } from "luxon";
import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });

export default function pacienteRegistrar(pacientes) {
  let cpf = "";
  let nome = "";
  let dataNascimento;
  let paciente;

  while (1) {
    if (!(cpf.length > 0)) cpf = prompt("CPF: ");
    else console.log(`CPF: ${cpf}`);

    if (!validaCpf(cpf)) {
      console.log("\nErro: CPF inválido!\n");
      cpf = "";
      continue;
    }

    if (pacientes.get(cpf)) {
      console.log("\nErro: CPF já cadastrado!\n");
      break;
    }

    if (!(nome.length > 0)) nome = prompt("Nome: ");
    else console.log(`Nome: ${nome}`);

    if (!padraoNome.test(nome)) {
      console.log("\nErro: nome inválido!\n");
      nome = "";
      continue;
    }

    dataNascimento = prompt("Data de nascimento: ");

    if (!padraoData.test(dataNascimento)) {
      console.log("\nErro: data inválida!\n");
      dataNascimento = "";
      continue;
    }

    dataNascimento = DateTime.fromFormat(dataNascimento, "dd/MM/yyyy");

    if (!validaDataNascimento(dataNascimento, DateTime.now())) {
      console.log("\nErro: paciente deve ter pelo menos 13 anos!\n");
      break;
    }

    paciente = new Paciente(cpf, nome, dataNascimento);

    pacientes.set(cpf, paciente);

    console.log("\nPaciente cadastrado com sucesso!\n");

    break;
  }
}
