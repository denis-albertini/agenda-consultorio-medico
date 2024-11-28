const mapaErros = new Map([
  [1, "Erro: CPF deve ter exatamente 11 dígitos!"],
  [2, "Erro: CPF inválido!"],
  [3, "Erro: nome inválido!"],
  [4, "Erro: data deve estar no formato dd/MM/aaaa!"],
  [5, "Erro: data não é futura!"],
  [6, "Erro: paciente deve ter pelo menos 13 anos!"],
  [7, "Erro: hora deve estar no formato HHMM!"],
  [8, "Erro: hora não é futura!"],
  [9, "Erro: hora fora do horário de funcionamento do Consultório!"],
  [10, "Erro: consultas só podem conter intervalos de 15 minutos!"],
  [11, "Erro: hora final deve ser superior à hora inicial!"],
  [12, "Erro: objeto não é um paciente"],
  [13, "Erro: paciente não cadastrado!"],
  [14, "Erro: paciente já cadastrado!"],
  [15, "Erro: paciente possui agendamento marcado!"],
  [16, "Erro: objeto não é uma Consulta!"],
  [17, "Erro: já existe uma consulta agendada nesse horário!"],
  [18, "Erro: agendamento não encontrado!"],
  [19, "Erro: opção inválida!"],
]);

const mapaSucesso = new Map([
  [1, "Paciente cadastrado com sucesso!"],
  [2, "Paciente excluído com sucesso!"],
  [3, "Agendamento realizado com sucesso!"],
  [4, "Agendamento cancelado com sucesso!"],
]);

export { mapaErros, mapaSucesso };
