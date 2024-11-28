import Consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default function pacienteListar(opcao) {
  const consultorio = new Consultorio();

  output(consultorio.listarPacientes(opcao));
}
