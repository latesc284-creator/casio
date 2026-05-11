import { createPlayer } from "./Players/CreatePlayer.js";
import { loginPlayer } from "./Players/LoginPlayer.js";
import { dataUser } from "./Players/dataUser.js";
import { updatePlayerPassword}  from "./Players/ChangePassword.js"

class PlayersController {
  createPlayer = createPlayer;
  loginPlayer = loginPlayer;
  dataUser = dataUser;
  updatePlayerPassword = updatePlayerPassword;
}   

export default new PlayersController();