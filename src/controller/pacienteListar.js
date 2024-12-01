import consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default function pacienteListar(opcao) {
  output(consultorio.listarPacientes(opcao));
}
