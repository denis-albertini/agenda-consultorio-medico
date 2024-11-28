import Consultorio from "./model/consultorio.js";
import menuPrincipal from "./view/menuPrincipal.js";

process.stdout.setDefaultEncoding("utf8");

const consultorio = new Consultorio();

while (1) {
  menuPrincipal();
}
