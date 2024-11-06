import { padraoCpf, padraoData, padraoHora } from "./padroes.js";
import Paciente from "./paciente.js";
import Consulta from "./consulta.js";
import Agenda from "./agenda.js";
import { DateTime } from "luxon";
import PromptSync from "prompt-sync";
const prompt = PromptSync();

process.stdout.setDefaultEncoding("utf8");

const pacientes = new Map();
const agenda = new Agenda();
const menuPrincipal = `\nMenu Principal\n1-Cadastro de Pacientes\n2-Agenda\n3-Fim\n`;
const menuCadastroPacientes =
  "\nMenu do Cadastro de Pacientes\n1-Cadastrar novo paciente\n2-Excluir paciente\n3-Listar pacientes (ordenado por CPF)\n4-Listar pacientes (ordenado por nome)\n5-Voltar p/ menu principal\n";
const menuAgenda =
  "\nAgenda\n1-Agendar consulta\n2-Cancelar agendamento\n3-Listar agenda\n4-Voltar p/ menu principal\n";

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
  else throw new Error("Erro: parâmetro inválido no método listarPacientes()!");

  let listados = "";

  ordenados.forEach((paciente) => {
    listados += `\n${paciente.cpf} ${paciente.nome.padEnd(
      32,
      " "
    )} ${DateTime.fromISO(paciente.dataNascimento).toFormat(
      "dd/MM/yyyy"
    )}  ${Math.trunc(
      DateTime.now().diff(paciente.dataNascimento, "years").years
    )
      .toString()
      .padStart(3, "0")}`;
  });

  return `\n------------------------------------------------------------\nCPF         Nome                              Dt.Nacs. Idade\n------------------------------------------------------------${listados}\n------------------------------------------------------------`;
}

function ordenarConsultas() {
  let mapDatas = (() => {
    return agenda.consultas.reduce((map, consulta) => {
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
          DateTime.fromFormat(key, "dd/MM/yyyy") >=
            DateTime.fromFormat(dataInicial, "dd/MM/yyyy") &&
          DateTime.fromFormat(key, "dd/MM/yyyy") <=
            DateTime.fromFormat(dataFinal, "dd/MM/yyyy")
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
      listados += `\n${
        value.indexOf(consulta) === 0
          ? DateTime.fromISO(consulta.data).toFormat("dd/MM/yyyy")
          : "          "
      } ${DateTime.fromISO(consulta.horaInicial).toFormat(
        "HH:mm"
      )} ${DateTime.fromISO(consulta.horaFinal).toFormat("HH:mm")} ${
        tempo.slice(0, 2) + ":" + tempo.slice(2)
      } ${pacientes.get(consulta.cpf).nome.padEnd(21, " ")} ${DateTime.fromISO(
        pacientes.get(consulta.cpf).dataNascimento
      ).toFormat("dd/MM/yyyy")}`;
    });
  });

  return `\n-------------------------------------------------------------\n   Data    H.Ini H.Fim Tempo Nome                   Dt.Nasc. \n-------------------------------------------------------------${listados}\n-------------------------------------------------------------`;
}

let opcao;
let paciente;
let consulta;
let cpf;
let data;
let horaInicial;
let dataInicial;
let dataFinal;
while (1) {
  console.log(menuPrincipal);
  opcao = prompt("Opção: ");

  switch (opcao) {
    case "1":
      console.log(menuCadastroPacientes);
      opcao = prompt("Opção: ");
      paciente = new Paciente();

      switch (opcao) {
        case "1":
          console.log();
          while (1) {
            try {
              if (!paciente.cpf) paciente.cpf = prompt("CPF: ");
              else console.log(`CPF: ${paciente.cpf}`);
              if (!paciente.nome) paciente.nome = prompt("Nome: ");
              else console.log(`Nome: ${paciente.nome}`);
              if (!paciente.dataNascimento)
                paciente.dataNascimento = prompt("Data de nascimento: ");
            } catch (error) {
              console.log(`\n${error.message}\n`);
            }
            if (paciente.cpf && paciente.nome && paciente.dataNascimento) {
              pacientes.set(paciente.cpf, paciente);
              console.log("\nPaciente cadastrado com sucesso!\n");
              break;
            }
          }
          break;

        case "2":
          console.log();
          while (1) {
            cpf = prompt("CPF: ");
            paciente = pacientes.get(cpf);
            if (paciente instanceof Paciente)
              if (paciente.agendado === false) {
                agenda.apagarHistorico(paciente);
                pacientes.delete(cpf);
                console.log("\nPaciente excluído com sucesso!\n");
                break;
              } else console.log("\nPaciente está agendado!\n");
            else console.log("\nErro: paciente não cadastrado!\n");
          }
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
      consulta = new Consulta();

      switch (opcao) {
        case "1":
          console.log();
          while (1) {
            try {
              if (!consulta.cpf) consulta.cpf = pacientes.get(prompt("CPF: "));
              else console.log(`CPF: ${consulta.cpf}`);
              if (!consulta.data) consulta.data = prompt("Data da consulta: ");
              else
                console.log(
                  `Data da consulta: ${DateTime.fromISO(consulta.data).toFormat(
                    "dd/MM/yyyy"
                  )}`
                );
              if (!consulta.horaInicial)
                consulta.horaInicial = prompt("Hora inicial: ");
              else
                console.log(
                  `Hora inicial: ${DateTime.fromISO(
                    consulta.horaInicial
                  ).toFormat("HH:mm")}`
                );
              if (!consulta.horaFinal)
                consulta.horaFinal = prompt("Hora final: ");
            } catch (error) {
              console.log(`\n${error.message}\n`);
            }
            if (
              consulta.cpf &&
              consulta.data &&
              consulta.horaInicial &&
              consulta.horaFinal
            )
              try {
                agenda.adicionarConsulta(consulta);
                pacientes.get(consulta.cpf).agendado = consulta;
                console.log("\nAgendamento realizado com sucesso!\n");
                break;
              } catch (error) {
                console.log(`\n${error.message}\n`);
                consulta = new Consulta();
              }
          }
          break;

        case "2":
          console.log();
          while (1) {
            while (1) {
              cpf = prompt("CPF: ");
              if (!padraoCpf.test(cpf)) console.log("Erro: CPF inválido!");
              else break;
            }
            paciente = pacientes.get(cpf);
            if (paciente instanceof Paciente) {
              data = prompt("Data da consulta: ");
              if (padraoData.test(data)) {
                horaInicial = prompt("Hora inicial: ");
                if (padraoHora.test(horaInicial))
                  try {
                    agenda.removerConsulta(cpf, data, horaInicial);
                    console.log("\nAgendamento cancelado com sucesso!\n");
                  } catch (error) {
                    console.log(`\n${error.message}\n`);
                  }
                else console.log("\nErro: hora deve estar no padrão HHMM!");
              } else
                console.log("\nErro: data deve estar no padrão dd/MM/aaaa!");
            } else {
              console.log("\nErro: paciente não cadastrado!\n");
              break;
            }
          }
          break;

        case "3":
          console.log();
          opcao = prompt("Apresentar a agenda T-toda ou P-período: ");

          switch (opcao.toUpperCase()) {
            case "T":
              console.log(listarAgenda());
              break;
            case "P":
              dataInicial = prompt("Data inicial: ");
              dataFinal = prompt("Data final: ");
              console.log(listarAgenda(dataInicial, dataFinal));
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
