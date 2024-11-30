import consultorio from "../model/consultorio.js";
import consultaRegistrarForm from "../view/consultaRegistrarForm.js";
import Consulta from "../model/consulta.js";
import output from "../view/output.js";

export default function consultaRegistrar(cpfForm) {
  const cpf = cpfForm.cpf;

  const validaCpf = consultorio.buscarPaciente(cpf);
  if (validaCpf.isFailure) {
    output(validaCpf);
    return;
  }
  const paciente = validaCpf.value;

  const consultaForm = consultaRegistrarForm();
  const data = consultaForm.data;
  const horaInicial = consultaForm.horaInicial;
  const horaFinal = consultaForm.horaFinal;

  const validaConsulta = new Consulta(data, horaInicial, horaFinal, paciente);
  if (validaConsulta.isFailure) {
    output(validaConsulta);
    return;
  }
  const consulta = validaConsulta.value;

  output(consultorio.registrarConsulta(consulta));
}
