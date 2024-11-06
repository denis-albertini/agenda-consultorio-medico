import { DateTime } from "luxon";

export function dataFutura(data) {
  let dataAtual = DateTime.now();
  if (
    data.day >= dataAtual.day &&
    data.month >= dataAtual.month &&
    data.year >= dataAtual.year
  )
    return true;
  else return false;
}

export function dataHoraFutura(data, horaInicial) {
  let dataAtual = DateTime.now();
  if (
    data.day >= dataAtual.day &&
    data.month >= dataAtual.month &&
    data.year >= dataAtual.year
  )
    if (
      data.hasSame(dataAtual, "day") &&
      data.hasSame(dataAtual, "month") &&
      data.hasSame(dataAtual, "year")
    )
      if (horaInicial.hour >= dataAtual.hour)
        if (horaInicial.hasSame(dataAtual, "hour"))
          if (horaInicial.minute > dataAtual.minute) return true;
          else return false;
        else return true;
      else return false;
    else return true;
  else return false;
}
