const padraoCpf = /^(?!.*(\d)\1{10})\d{11}$/;
const padraoNome = /^[a-zA-Z ]{5,}$/;
const padraoData = /^\d{2}\/\d{2}\/\d{4}$/;
const padraoHora = /\b([01]?[0-9]|2[0-3])[0-5][0-9]\b/;

export { padraoCpf, padraoNome, padraoData, padraoHora };
