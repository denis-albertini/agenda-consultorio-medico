import { mapaErros, mapaSucesso } from "../model/mapaValidacao.js";

export default function output(resultado) {
  console.log();

  if (resultado.isFailure) {
    resultado.errors.forEach((erro) => {
      console.log(mapaErros.get(erro));
    });

    console.log();

    return;
  }

  console.log(mapaSucesso.get(resultado.value) || resultado.value);

  console.log();
}
