import Consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default function pacienteRemover(cpfForm) {
  const cpf = cpfForm.cpf;

  const consultorio = new Consultorio();

  output(consultorio.removerPaciente(cpf));
}
