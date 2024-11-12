import { padraoData } from "./padroes.js";
import { DateTime } from "luxon";
import pacienteRegistrar from "./pacienteRegistrar.js";
import pacienteRemover from "./pacienteRemover.js";
import consultaRegistrar from "./consultaRegistrar.js";
import consultaRemover from "./consultaRemover.js";
import PromptSync from "prompt-sync";
const prompt = PromptSync();

process.stdout.setDefaultEncoding("utf8");

const pacientes = new Map();
const consultas = [];
const menuPrincipal =
  "\nMenuPrincial" + "\n1-Cadastro de Pacientes" + "\n2-Agenda" + "\n3-Fim\n";
const menuCadastroPacientes =
  "\nMenu do Cadastro de Pacientes" +
  "\n1-Cadastrar novo paciente" +
  "\n2-Excluir paciente" +
  "\n3-Listar pacientes (ordenado por CPF)" +
  "\n4-Listar pacientes (ordenado por nome)" +
  "\n5-Voltar p/ menu principal\n";
const menuAgenda =
  "\nAgenda" +
  "\n1-Agendar consulta" +
  "\n2-Cancelar agendamento" +
  "\n3-Listar agenda" +
  "\n4-Voltar p/ menu principal\n";

function ordenarPacientesCpf() {
  return Array.from(pacientes.values()).sort((paciente1, paciente2) => {
    return Number(paciente1.cpf) - Number(paciente2.cpf);
  });
}

function ordenarPacientesNome() {
  return Array.from(pacientes.values()).sort((paciente1, paciente2) => {
    if (paciente1.nome.toLowerCase() < paciente2.nome.toLowerCase()) return -1;
    if (paciente1.nome.toLowerCase() > paciente2.nome.toLowerCase()) return 1;
    return 0;
  });
}

function listarPacientes(opcao) {
  let ordenados;

  if (opcao === 3) ordenados = ordenarPacientesCpf();
  else if (opcao === 4) ordenados = ordenarPacientesNome();
  else return false;

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

  return (
    "\n------------------------------------------------------------" +
    "\nCPF         Nome                              Dt.Nacs. Idade" +
    "\n------------------------------------------------------------" +
    listados +
    "\n------------------------------------------------------------"
  );
}

function ordenarConsultas() {
  let mapDatas = (() => {
    return consultas.reduce((map, consulta) => {
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

function listarAgenda(dataInicial, dataFinal) {
  let listados = "";
  let ordenados = ordenarConsultas();
  let filtrados;

  if (arguments.length === 2)
    filtrados = new Map(
      Array.from(ordenados).filter(
        ([key]) =>
          DateTime.fromFormat(key, "dd/MM/yyyy") >= dataInicial &&
          DateTime.fromFormat(key, "dd/MM/yyyy") <= dataFinal
      )
    );
  else filtrados = ordenados;

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

  return (
    "\n-------------------------------------------------------------" +
    "\n   Data    H.Ini H.Fim Tempo Nome                   Dt.Nasc. " +
    "\n-------------------------------------------------------------" +
    listados +
    "\n-------------------------------------------------------------"
  );
}

let opcao;

while (1) {
  console.log(menuPrincipal);
  opcao = prompt("Opção: ");

  switch (opcao) {
    case "1":
      console.log(menuCadastroPacientes);
      opcao = prompt("Opção: ");

      switch (opcao) {
        case "1":
          console.log();

          pacienteRegistrar(pacientes);

          break;

        case "2":
          console.log();

          pacienteRemover(pacientes, consultas);

          break;

        case "3":
          console.log(listarPacientes(3));
          break;

        case "4":
          console.log(listarPacientes(4));
          break;

        case "5":
          break;

        default:
          break;
      }

      break;

    case "2":
      console.log(menuAgenda);
      opcao = prompt("Opção: ");

      switch (opcao) {
        case "1":
          console.log();

          consultaRegistrar(consultas, pacientes);

          break;

        case "2":
          console.log();

          consultaRemover(pacientes, consultas);

          break;

        case "3":
          console.log();

          opcao = prompt("Apresentar a agenda T-toda ou P-período: ");

          switch (opcao.toUpperCase()) {
            case "T":
              console.log(listarAgenda());
              break;

            case "P":
              let dataInicial = "";
              let dataFinal;

              while (1) {
                if (!(dataInicial.length > 0))
                  dataInicial = prompt("Data inicial: ");
                else console.log(`Data inicial: ${dataInicial}`);

                if (!padraoData.test(dataInicial)) {
                  console.log(
                    "\nErro: data deve estar no formato dd/MM/aaaa!\n"
                  );
                  dataInicial = "";
                  continue;
                }

                dataFinal = prompt("Data final: ");

                if (!padraoData.test(dataFinal)) {
                  console.log(
                    "\nErro: data deve estar no formato dd/MM/aaaa!\n"
                  );
                  continue;
                }

                console.log(
                  listarAgenda(
                    DateTime.fromFormat(dataInicial, "dd/MM/yyyy"),
                    DateTime.fromFormat(dataFinal, "dd/MM/yyyy")
                  )
                );

                break;
              }

              break;
          }

          break;

        case "4":
          break;

        default:
          break;
      }

      break;

    case "3":
      process.exit();

    default:
      break;
  }
}
