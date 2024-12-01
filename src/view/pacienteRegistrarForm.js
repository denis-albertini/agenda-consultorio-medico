import PromptSync from "prompt-sync";

const prompt = PromptSync({ sigint: true });

export default function pacienteResgistrarForm() {
  const nome = prompt("Nome: ");
  const dataNascimento = prompt("Data de nascimento: ");

  return {
    nome: nome,
    dataNascimento: dataNascimento,
  };
}
