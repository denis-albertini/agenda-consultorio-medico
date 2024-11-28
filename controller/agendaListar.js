import Consultorio from "../model/consultorio.js";
import output from "../view/output.js";

export default function agendaListar(formulario) {
  const opcao = formulario.opcao;

  const consultorio = new Consultorio();

  if (opcao !== "P") {
    output(consultorio.listarAgenda());
    return;
  }

  const dataInicial = formulario.dataInicial;
  const dataFinal = formulario.dataFinal;

  output(consultorio.listarAgenda(dataInicial, dataFinal));
}
