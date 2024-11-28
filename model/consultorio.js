import { validarCpf, validarData, validarHoraInicial } from "./validador.js";
import Paciente from "./paciente.js";
import Consulta from "./consulta.js";
import Result from "./result.js";
import { DateTime } from "luxon";

export default class Consultorio {
  static #instancia = null;
  #horaAbertura = DateTime.fromFormat("0800", "HHmm");
  #horaFechamento = DateTime.fromFormat("1900", "HHmm");
  #pacientes = new Map();
  #consultas = [];

  get horaAbertura() {
    return this.#horaAbertura;
  }
  get horaFechamento() {
    return this.#horaFechamento;
  }

  constructor() {
    if (!Consultorio.#instancia) Consultorio.#instancia = this;

    return Consultorio.#instancia;
  }

  buscarPaciente(cpf) {
    const validaCpf = validarCpf(cpf);
    if (validaCpf.isFailure) return validaCpf;
    cpf = validaCpf.value;

    const paciente = this.#pacientes.has(cpf) ? this.#pacientes.get(cpf) : null;

    if (paciente === null) return Result.failure(13);

    return Result.success(paciente);
  }

  registrarPaciente(paciente) {
    if (!(paciente instanceof Paciente)) return Result.failure(12);

    const buscaPaciente = this.buscarPaciente(paciente.cpf);
    if (buscaPaciente.isSuccess) return Result.failure(14);

    this.#pacientes.set(paciente.cpf, paciente);

    return Result.success(1);
  }

  #verificarAgendado(cpf) {
    const buscaPaciente = this.buscarPaciente(cpf);
    if (buscaPaciente.isFailure) return buscaPaciente;
    const paciente = buscaPaciente.value;

    return Result.success(paciente.agendado);
  }

  removerPaciente(cpf) {
    const verificaAgendado = this.#verificarAgendado(cpf);
    if (verificaAgendado.isFailure) return verificaAgendado;
    if (verificaAgendado.value === true) return Result.failure(15);

    this.#apagarHistorico(cpf);

    this.#pacientes.delete(cpf);

    return Result.success(2);
  }

  #apagarHistorico(cpf) {
    let consultasApagadas = 0;

    this.#consultas.forEach((consulta) => {
      if (cpf !== consulta.paciente.cpf) return;

      this.#consultas.splice(this.#consultas.indexOf(consulta), 1);

      consultasApagadas++;
    });

    return Result.success(consultasApagadas);
  }

  #buscarConsulta(cpf, data, horaInicial) {
    const erros = [];

    const validaCpf = this.buscarPaciente(cpf);
    if (validaCpf.isFailure) erros.push(...validaCpf.errors);

    const validaHora = validarHoraInicial(horaInicial, data, this);
    if (validaHora.isFailure) erros.push(...validaHora.errors);
    horaInicial = validaHora.value.horaInicial;
    data = validaHora.value.data;

    if (erros.length > 0) return Result.failure(erros);

    let consulta;
    this.#consultas.forEach((outraConsulta) => {
      if (
        outraConsulta.paciente.cpf !== cpf ||
        (outraConsulta.data.year !== data.year &&
          outraConsulta.data.month !== data.month &&
          outraConsulta.data.day !== data.day &&
          outraConsulta.horaInicial.hour !== horaInicial.hour &&
          outraConsulta.horaInicial.minute !== horaInicial.minute)
      )
        return;

      consulta = outraConsulta;
    });

    if (!(consulta instanceof Consulta)) return Result.failure(18);

    return Result.success(consulta);
  }

  registrarConsulta(consulta) {
    if (!(consulta instanceof Consulta)) return Result.failure(16);

    const validaNovaConsulta = this.#validarNovaConsulta(consulta);
    if (validaNovaConsulta.isFailure) return validaNovaConsulta;

    this.#consultas.push(consulta);
    consulta.paciente.agendado = consulta;

    return Result.success(3);
  }

  #validarNovaConsulta(consulta) {
    let result = Result.success(consulta);

    if (
      consulta.horaInicial.hour < this.#horaAbertura.hour ||
      consulta.horaInicial.hour >= this.#horaFechamento.hour ||
      consulta.horaFinal.hour > this.#horaFechamento.hour
    )
      return Result.failure(9);

    this.#consultas.forEach((outraConsulta) => {
      if (!consulta.data.equals(outraConsulta.data)) return;

      if (
        (consulta.horaInicial.hour >= outraConsulta.horaInicial.hour &&
          consulta.horaInicial.hour <= outraConsulta.horaFinal.hour) ||
        (consulta.horaFinal.hour >= outraConsulta.horaFinal.hour &&
          consulta.horaFinal.hour <= outraConsulta.horaFinal.hour)
      )
        result = Result.failure(17);
    });

    return result;
  }

  removerConsulta(cpf, data, horaInicial) {
    const validaConsulta = this.#buscarConsulta(cpf, data, horaInicial);
    if (validaConsulta.isFailure) return validaConsulta;
    const consulta = validaConsulta.value;

    this.#consultas.splice(this.#consultas.indexOf(consulta), 1);

    return Result.success(4);
  }

  #ordenarPacientesCpf() {
    return Array.from(this.#pacientes.values()).sort((paciente1, paciente2) => {
      return Number(paciente1.cpf) - Number(paciente2.cpf);
    });
  }

  #ordenarPacientesNome() {
    return Array.from(this.#pacientes.values()).sort((paciente1, paciente2) => {
      if (paciente1.nome.toLowerCase() < paciente2.nome.toLowerCase())
        return -1;
      if (paciente1.nome.toLowerCase() > paciente2.nome.toLowerCase()) return 1;
      return 0;
    });
  }

  listarPacientes(opcao) {
    let ordenados;

    if (opcao === 3) ordenados = this.#ordenarPacientesCpf();
    else if (opcao === 4) ordenados = this.#ordenarPacientesNome();
    else return Result.failure(19);

    let listados = "";

    ordenados.forEach((paciente) => {
      listados +=
        `\n${paciente.cpf} ${paciente.nome.padEnd(32, " ")}` +
        ` ${DateTime.fromISO(paciente.dataNascimento).toFormat("dd/MM/yyyy")}` +
        `  ${Math.trunc(
          DateTime.now().diff(paciente.dataNascimento, "years").years
        )
          .toString()
          .padStart(3, "0")}`;
    });

    const result =
      "\n------------------------------------------------------------" +
      "\nCPF         Nome                              Dt.Nacs. Idade" +
      "\n------------------------------------------------------------" +
      listados +
      "\n------------------------------------------------------------";

    return Result.success(result);
  }

  #ordenarConsultas() {
    let mapDatas = (() => {
      return this.#consultas.reduce((map, consulta) => {
        let key = DateTime.fromISO(consulta.data).toFormat("dd/MM/yyyy");

        if (!map.has(key)) map.set(key, []);

        map.get(key).push(consulta);

        return map;
      }, new Map());
    })();

    mapDatas.forEach((value, key) => {
      mapDatas.set(
        key,
        (() => {
          return value.sort((consulta1, consulta2) => {
            return (
              Number(DateTime.fromISO(consulta1.horaInicial).toFormat("HHmm")) -
              Number(DateTime.fromISO(consulta2.horaInicial).toFormat("HHmm"))
            );
          });
        })()
      );
    });

    return mapDatas;
  }

  listarAgenda(dataInicial, dataFinal) {
    let listados = "";
    let ordenados = this.#ordenarConsultas();
    let filtrados;

    if (arguments.length === 2) {
      const erros = [];

      const validaDataInicial = validarData(dataInicial);
      if (validaDataInicial.isFailure) erros.push(...validaDataInicial.errors);
      dataInicial = validaDataInicial.value;

      const validaDataFinal = validarData(dataFinal);
      if (validaDataFinal.isFailure) erros.push(...validaDataFinal.errors);
      dataFinal = validaDataFinal.value;

      if (erros.length > 0) return Result.failure(erros);

      filtrados = new Map(
        Array.from(ordenados).filter(
          ([key]) =>
            DateTime.fromFormat(key, "dd/MM/yyyy") >= dataInicial &&
            DateTime.fromFormat(key, "dd/MM/yyyy") <= dataFinal
        )
      );
    } else filtrados = ordenados;

    filtrados.forEach((value) => {
      value.forEach((consulta) => {
        let tempo = (
          Number(DateTime.fromISO(consulta.horaFinal).toFormat("HHmm")) -
          Number(DateTime.fromISO(consulta.horaInicial).toFormat("HHmm"))
        )
          .toString()
          .padStart(4, "0");

        listados +=
          `\n${
            value.indexOf(consulta) === 0
              ? DateTime.fromISO(consulta.data).toFormat("dd/MM/yyyy")
              : "          "
          }` +
          ` ${DateTime.fromISO(consulta.horaInicial).toFormat("HH:mm")}` +
          ` ${DateTime.fromISO(consulta.horaFinal).toFormat("HH:mm")}` +
          ` ${tempo.slice(0, 2) + ":" + tempo.slice(2)}` +
          ` ${consulta.paciente.nome.padEnd(21, " ")}` +
          ` ${DateTime.fromISO(consulta.paciente.dataNascimento).toFormat(
            "dd/MM/yyyy"
          )}`;
      });
    });

    const result =
      "\n-------------------------------------------------------------" +
      "\n   Data    H.Ini H.Fim Tempo Nome                   Dt.Nasc. " +
      "\n-------------------------------------------------------------" +
      listados +
      "\n-------------------------------------------------------------";

    return Result.success(result);
  }
}
