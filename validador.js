import { padraoCpf } from "./padroes.js";
import { horaFutura } from "./dataUtil.js";

function validaCpf(cpf) {
  let J = (() => {
    let sum = 0;
    for (let i = 0; i <= 8; i++) sum += Number(cpf[i]) * Math.abs(i - 10);

    if (sum % 11 === 0 || sum % 11 === 1) return 0;

    if (sum % 11 >= 2 || sum % 11 <= 10) return 11 - (sum % 11);

    return null;
  })();

  let K = (() => {
    let sum = 0;

    for (let i = 0; i <= 9; i++) sum += Number(cpf[i]) * Math.abs(i - 11);

    if (sum % 11 === 0 || sum % 11 === 1) return 0;

    if (sum % 11 >= 2 || sum % 11 <= 10) return 11 - (sum % 11);

    return null;
  })();

  if (!padraoCpf.test(cpf) || !(cpf[9] == J) || !(cpf[10] == K)) return false;

  return true;
}

function validaDataNascimento(data, dataAtual) {
  if (dataAtual.diff(data, "years").years < 13) return false;

  return true;
}

function validaHoraInicial(data, hora, dataAtual) {
  if (hora.hour < 8 || hora.hour >= 19) return false;

  if (hora.minute % 15 !== 0) return false;

  if (!horaFutura(data, hora, dataAtual)) return false;

  return true;
}

function validaHoraFinal(horaInicial, horaFinal) {
  if (horaFinal <= horaInicial) return false;

  if (horaFinal.hour > 19) return false;

  if (horaFinal.minute % 15 !== 0) return false;

  return true;
}

function validaNovaConsulta(
  data,
  horaInicial,
  horaFinal,
  dataAtual,
  consultas
) {
  let result = true;

  consultas.forEach((consulta) => {
    if (!horaFutura(consulta.data, consulta.horaInicial, dataAtual)) return;

    if (!data.equals(consulta.data)) return;

    if (
      (horaInicial.hour >= consulta.horaInicial.hour &&
        horaInicial.hour <= consulta.horaFinal.hour) ||
      (horaFinal.hour >= consulta.horaFinal.hour &&
        horaFinal.hour <= consulta.horaFinal.hour)
    )
      result = false;
  });

  return result;
}

function validaCancelamentoConsulta(cpf, data, horaInicial, consultas) {
  consultas.forEach((consulta) => {
    if (
      consulta.cpf !== cpf ||
      consulta.data !== data ||
      consulta.horaInicial !== horaInicial
    )
      return;

    return true;
  });

  return false;
}

export {
  validaCpf,
  validaDataNascimento,
  validaHoraInicial,
  validaHoraFinal,
  validaNovaConsulta,
  validaCancelamentoConsulta,
};
