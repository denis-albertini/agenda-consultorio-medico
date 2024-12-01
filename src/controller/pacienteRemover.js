import consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default function pacienteRemover(cpfForm) {
  const cpf = cpfForm.cpf;

  output(consultorio.removerPaciente(cpf));
}
