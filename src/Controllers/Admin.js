import { createAdmin } from "./admin/CreateAdmin.js";
import { loginAdmin } from "./admin/LoginAdmin.js";
//desde aqui son las rutas que va amanejar el admin de los usuarios

import { addCredits } from "./Players/addCredits.js";
import { removeCredits } from "./Players/removeCredits.js";
import { AllPlayer } from "./Players/AllPlayer.js";

class AdminController {
  createAdmin = createAdmin;
  loginAdmin = loginAdmin;
  addCredits = addCredits;
  removeCredits = removeCredits;
  AllPlayer = AllPlayer;
}

export default new AdminController();
