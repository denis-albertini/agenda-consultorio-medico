function dataFutura(data, dataAtual) {
  if (data.year < dataAtual.year) return false;

  if (data.year === dataAtual.year && data.month < dataAtual.month)
    return false;

  if (
    data.year === dataAtual.year &&
    data.month === dataAtual.month &&
    data.day < dataAtual.day
  )
    return false;

  return true;
}

function horaFutura(data, hora, dataAtual) {
  if (!dataFutura(data, dataAtual)) return false;

  if (
    data.year !== dataAtual.year ||
    data.month !== dataAtual.month ||
    data.day !== dataAtual.day
  )
    return true;

  if (hora.hour < dataAtual.hour) return false;

  if (!(hora.hour === dataAtual.hour)) return true;

  if (hora.minute <= dataAtual.minute) return false;

  return true;
}

export { dataFutura, horaFutura };
