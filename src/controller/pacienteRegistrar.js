import consultorio from "../model/consultorio.js";
import pacienteRegistrarForm from "../view/pacienteRegistrarForm.js";
import Paciente from "../model/paciente.js";
import output from "../view/output.js";

export default function pacienteRegistrar(cpfForm) {
  const cpf = cpfForm.cpf;

  const validaCpf = consultorio.buscarPaciente(cpf);
  if (validaCpf.isFailure && !validaCpf.errors.find((erro) => erro === 13)) {
    output(validaCpf);
    return;
  }

  const pacienteForm = pacienteRegistrarForm();
  const nome = pacienteForm.nome;
  const dataNascimento = pacienteForm.dataNascimento;

  const validaPaciente = new Paciente(cpf, nome, dataNascimento);
  if (validaPaciente.isFailure) {
    output(validaPaciente);
    return;
  }
  const paciente = validaPaciente.value;

  output(consultorio.registrarPaciente(paciente));
}
