import cpfForm from "./cpfForm.js";
import pacienteListar from "../controller/pacienteListar.js";
import PromptSync from "prompt-sync";

const prompt = PromptSync();

const menu =
  "Menu do Cadastro de Pacientes" +
  "\n1-Cadastrar novo paciente" +
  "\n2-Excluir paciente" +
  "\n3-Listar pacientes (ordenado por CPF)" +
  "\n4-Listar pacientes (ordenado por nome)" +
  "\n5-Voltar p/ menu principal";

export default function menuPacientes() {
  console.log(menu);

  console.log();

  const opcao = prompt("Opção: ");

  console.log();

  switch (Number(opcao)) {
    case 1:
      cpfForm(1.1);
      break;
    case 2:
      cpfForm(1.2);
      break;
    case 3:
      pacienteListar(3);
      break;
    case 4:
      pacienteListar(4);
      break;
    case 5:
      break;
    default:
      break;
  }
}
