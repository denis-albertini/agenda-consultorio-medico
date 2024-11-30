class Padroes {
  padraoCpf = /^(?!.*(\d)\1{10})\d{11}$/;
  padraoNome = /^[a-zA-Z ]{5,}$/;
  padraoData = /\b(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}\b/;
  padraoHora = /\b([01]?[0-9]|2[0-3])[0-5][0-9]\b/;
}

const padroes = new Padroes();

export default padroes;
