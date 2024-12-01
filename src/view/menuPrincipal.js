import menuPacientes from "./menuPacientes.js";
import menuAgenda from "./menuAgenda.js";
import PromptSync from "prompt-sync";

const prompt = PromptSync();

const menu = "MenuPrincial" + "\n1-Pacientes" + "\n2-Agenda" + "\n3-Fim";

export default function menuPrincipal() {
  console.log(menu);

  console.log();

  const opcao = prompt("Opção: ");

  console.log();

  switch (Number(opcao)) {
    case 1:
      menuPacientes();
      break;
    case 2:
      menuAgenda();
      break;
    case 3:
      process.exit();
    default:
      break;
  }
}
