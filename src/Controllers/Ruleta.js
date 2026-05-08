import { girarRuleta } from "../Controllers/Games/Ruleta/Ruleta.js";
import { getSaldo } from "../Controllers/Games/Ruleta/getCredits.js";

class RuletaController {
  girarRuleta = girarRuleta;
  getSaldo = getSaldo;
}

export default new RuletaController();
